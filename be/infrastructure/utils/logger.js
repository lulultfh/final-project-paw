const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../login-activity.log');

// Fungsi untuk menulis log
const logActivity = (message) => {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  
  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) {
      console.error('Gagal menulis log:', err);
    }
  });
};

module.exports = { logActivity };
