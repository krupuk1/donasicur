# 🤝 Website Donasi - Platform Penggalangan Dana

Website donasi mirip Kitabisa.com yang memungkinkan pengguna membuat campaign dan berdonasi dengan mudah.

## 📋 Fitur Utama

### 👥 Untuk Pengguna
- ✅ Registrasi dan Login
- ✅ Membuat campaign donasi
- ✅ Donasi ke campaign
- ✅ Melihat history donasi
- ✅ Komentar di campaign
- ✅ Update progress campaign

### 👨‍💼 Untuk Admin
- ✅ Dashboard admin
- ✅ Moderasi campaign
- ✅ Melihat analytics
- ✅ Manajemen user
- ✅ Laporan transaksi

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TailwindCSS + TypeScript
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: MySQL 8.0
- **Pembayaran**: Tripay Gateway
- **Auth**: JWT + bcrypt
- **Upload**: Multer (local) / Cloudinary

## 📁 Struktur Proyek

```
donation-website/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App Router
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   ├── public/
│   └── package.json
├── backend/           # Express.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── database/          # SQL schemas
│   ├── migrations/
│   └── seeds/
└── docs/             # Documentation
```

## 🗃️ Database Schema

### Users Table
```sql
- id (Primary Key)
- username (Unique)
- email (Unique)  
- password (Hashed)
- full_name
- phone
- avatar
- role (user/admin)
- is_verified
- created_at
- updated_at
```

### Campaigns Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- title
- description
- story
- target_amount
- current_amount
- image_url
- category
- status (draft/active/completed/rejected)
- start_date
- end_date
- created_at
- updated_at
```

### Donations Table
```sql
- id (Primary Key)
- campaign_id (Foreign Key)
- user_id (Foreign Key)
- amount
- message
- is_anonymous
- payment_method
- payment_status
- tripay_reference
- created_at
- updated_at
```

### Comments Table
```sql
- id (Primary Key)
- campaign_id (Foreign Key)
- user_id (Foreign Key)
- content
- created_at
- updated_at
```

## 🔄 User Flow

### 1. Register/Login Flow
```
User → Register/Login → Email Verification → Dashboard
```

### 2. Create Campaign Flow
```
User → Dashboard → Create Campaign → Upload Image → 
Submit for Review → Admin Approval → Campaign Active
```

### 3. Donation Flow
```
User → Browse Campaigns → Select Campaign → 
Choose Amount → Payment Method → Tripay Gateway → 
Webhook Confirmation → Success Page
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0
- npm/yarn

### Installation

1. Clone repository
```bash
git clone <repo-url>
cd donation-website
```

2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure database dan Tripay credentials
npm run dev
```

3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

4. Setup Database
```bash
cd database
mysql -u root -p < schema.sql
mysql -u root -p < seeds.sql
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify email
- `POST /api/auth/logout` - Logout user

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign detail
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Donations
- `GET /api/donations` - Get user donations
- `POST /api/donations` - Create donation
- `POST /api/donations/webhook` - Tripay webhook

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/campaigns` - Pending campaigns
- `PUT /api/admin/campaigns/:id/approve` - Approve campaign
- `PUT /api/admin/campaigns/:id/reject` - Reject campaign

## 💳 Payment Integration

Website ini terintegrasi dengan Tripay untuk payment gateway:
- Virtual Account (BCA, Mandiri, BNI, BRI)
- E-Wallet (OVO, DANA, LinkAja, ShopeePay)
- Retail (Alfamart, Indomaret)

## 🔒 Security Features

- JWT Authentication
- Password hashing with bcrypt
- Input validation dan sanitization
- Rate limiting
- CORS protection
- SQL injection prevention

## 📊 Admin Dashboard Features

- Total donasi terkumpul
- Jumlah campaign aktif
- User registrations
- Recent transactions
- Campaign approval queue
- Analytics charts

---

**Developed with ❤️ for helping others**