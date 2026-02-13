# Frontend Next.js — QRIS Payment Page

## Run
```bash
cd frontend-nextjs
cp .env.example .env.local
npm install
npm run dev
```

## Routes
- `/checkout` (creates invoice)
- `/payment/[merchantOrderId]` (renders QR + polls status)
