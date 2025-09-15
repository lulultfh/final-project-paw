# Butter&Bliss: Sistem Penjualan dan Pengelolaan Bakery berbasis Website
![Logo](fe/public/logo-text.svg)

> this project was created for Final Project TI501P Pengembangan Aplikasi Web

## Table of Contents
- [Use Case Diagram](#use-case-diagram)
- [Project Structure](#project-structure)
- [API Testing Documentation](#api-testing-documentation)
- [How to Run](#how-to-run)
- [Author](#author)

### Features
#### Customers
- Browse bakery menu based on category (cake, bread, pastry, cookies)
- Product listing displays product images, descriptions, and prices.
- Product detail shows detailed information (dynamic route parameter).
- Shopping cart allows adding, removing, or adjusting product quantities.
- Checkout and invoice enables completing orders and generating invoices.
- User profile
- Transaction history lets users review past orders and their status.
#### Admin
- Dashboard provides an overview of sales, orders, and popular products.
- Manage Products enables adding, editing, removing products, and updating stock.
- Manage Orders allows viewing and processing customer orders.
### Tech Stack
- **Next.js 15 (App Router)**
- **Node.js 22**
- **Tailwind CSS**

## Use Case Diagram

## Project Structure
```
└── final-project-paw/
    ├── be/
    │   ├── infrastructure/
    │   │   ├── database                                # konfigurasi & koneksi database
    │   │   ├── middleware
    │   │   ├── routes                                  # route endpoint API
    │   │   └── utils                                   # helper function untuk backend
    │   ├── test                                        # test case / unit test backend
    │   ├── app.js                                      # entry point aplikasi backend
    │   ├── package.json
    │   └── server.js                                   # server setup & listening port
    ├── fe/
    │   ├── app/
    │   │   ├── (admin)/
    │   │   │   ├── home-admin/
    │   │   │   ├── manage-order/
    │   │   │   ├── manage-product/
    │   │   │   └── layout.js                            # layout khusus admin
    │   │   ├── (auth)/                                  # authentication pages
    │   │   │   ├── login/
    │   │   │   └── register/
    │   │   ├── (cust)/                                  # customer-facing pages
    │   │   │   ├── (shop)/                              # shopping-related pages
    │   │   │   │   ├── cart/
    │   │   │   │   └── product/
    │   │   │   │       └── [productId]                  # dynamic route for product detail
    │   │   │   ├── about-us/
    │   │   │   ├── invoice
    │   │   │   ├── order/
    │   │   │   ├── profile/
    │   │   │   │   └── edit/
    │   │   │   ├── transaction/
    │   │   │   ├── layout.js
    │   │   │   └── page.js                              # landing page customer
    │   │   ├── context/
    │   │   ├── global.css
    │   │   ├── layout.js
    │   │   └── not-found.js
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── dashboard/
    │   │   │   └── manage/
    │   │   └── cust/
    │   │       └── ui/
    │   ├── core/
    │   │   ├── domain/                                  # model & logic domain
    │   │   └── hooks/                                   # custom helper
    │   ├── public/
    │   │   ├── font/
    │   │   └── images/
    │   ├── Readme.md
    │   ├── package.json
    │   └── next.config.mjs                              # konfigurasi Next.js
    └── Readme.md                                        # dokumentasi utama projek
```
## API Testing Documentation

## How to Run

## Author
<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/lulultfh">
        <img src="https://avatars.githubusercontent.com/u/161204020?v=4"" width="80" style="border-radius: 50%;" /><br />
        <span><b>Lu'lu' Luthfiah</span>
      </a>
      <p>20230140209</p>
    </td>
    <td align="center">
      <a href="https://github.com/MannantaB">
        <img src="https://avatars.githubusercontent.com/u/160874974?v=4" width="80" style="border-radius: 50%;" /><br />
        <span><b>Mannanta Brilian C</span>
      </a>
      <p>20230140228</p>
    </td>
    <td align="center">
      <a href="https://github.com/azizazmi">
        <img src="https://avatars.githubusercontent.com/u/161433994?v=4" width="80" style="border-radius: 50%;" /><br />
        <span><b>Azizah Aurellia Azmi</span>
      </a>
      <p>20230140234</p>
    </td>
    <td align="center">
      <a href="https://github.com/husnakamilaa">
        <img src="https://avatars.githubusercontent.com/u/161220589?v=4" width="80" style="border-radius: 50%;" /><br />
        <span><b>Husna Kamila Syahida</span>
      </a>
      <p>20230140238</p>
    </td>
  </tr>
</table>
