# IMS Server (MERN)

This is a minimal backend for the Inventory Management System using Node/Express and MongoDB (Mongoose).

Quickstart

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. cd server && npm install
3. npm run seed
4. npm run dev

APIs

- POST /api/auth/register
- POST /api/auth/login
- GET /api/products
- POST /api/products (auth)
- GET /api/customers
- POST /api/customers (auth)
- GET /api/orders
- POST /api/orders (auth)

Notes

- The front-end should call these endpoints. JWT in Authorization header: `Bearer <token>`.
