const request = require('supertest');
const app = require('../app'); 
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../login-activity.log');

// Hapus log sebelum test dimulai
beforeAll(() => {
  if (fs.existsSync(LOG_FILE)) {
    fs.unlinkSync(LOG_FILE);
  }
});

// Test suite
describe('POST /api/user/login', () => {
  it('should return 200 and login success for valid credentials', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({
        username: 'admin', // ganti dengan username admin yang ada di DB
        passwd: 'admin123' // ganti dengan password yang benar
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login berhasil');
    expect(response.body.token).toBeDefined();

    // Cek apakah log berhasil ditulis
    const logContent = fs.readFileSync(LOG_FILE, 'utf8');
    expect(logContent).toContain('SUCCESS_LOGIN');
    expect(logContent).toContain('admin');
  });

  it('should return 400 and log failed login for missing fields', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({}); // kosong

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Username dan password wajib diisi!');

    const logContent = fs.readFileSync(LOG_FILE, 'utf8');
    expect(logContent).toContain('FAILED_LOGIN - Username atau password kosong');
  });

  it('should return 401 and log invalid password', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({
        username: 'admin',
        passwd: 'salah123' // password salah
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Username atau password salah');

    const logContent = fs.readFileSync(LOG_FILE, 'utf8');
    expect(logContent).toContain('FAILED_LOGIN - Password salah untuk user: admin');
  });

  it('should return 500 and log server error on database failure (mocked)', async () => {
    // Mock database query agar gagal
    jest.spyOn(require('../infrastructure/database/db'), 'query')
      .mockImplementationOnce(() => Promise.reject(new Error('Database connection failed')));

    const response = await request(app)
      .post('/api/user/login')
      .send({
        username: 'admin',
        passwd: 'password123'
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');

    const logContent = fs.readFileSync(LOG_FILE, 'utf8');
    expect(logContent).toContain('ERROR_LOGIN - Server error saat login user admin: Database connection failed');
    
    // Restore original function
    jest.restoreAllMocks();
  });
});