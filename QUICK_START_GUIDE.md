# 🚀 Quick Start Guide - Website Donasi

## 📋 Checklist Prerequisites

Pastikan Anda sudah menginstall:
- ✅ **Node.js 18+** ([Download](https://nodejs.org/))
- ✅ **MySQL 8.0+** ([Download](https://dev.mysql.com/downloads/))
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **Code Editor** (VS Code recommended)

## 🏃‍♂️ Quick Setup (5 Menit)

### 1. Clone & Navigate
```bash
git clone <your-repository-url>
cd donation-website
```

### 2. Database Setup
```bash
# Login ke MySQL
mysql -u root -p

# Buat database dan import schema
mysql -u root -p < database/schema.sql

# Import data dummy
mysql -u root -p < database/seeds.sql
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env  # atau gunakan editor favorit Anda
```

**Konfigurasi .env minimal:**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=donation_website

# JWT Secret (generate random string)
JWT_SECRET=your-super-secret-jwt-key-123456

# Email (untuk testing, gunakan Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Tripay (untuk testing, gunakan sandbox)
TRIPAY_MERCHANT_CODE=T1234
TRIPAY_API_KEY=DEV-your-sandbox-key
TRIPAY_PRIVATE_KEY=your-sandbox-private-key
TRIPAY_IS_PRODUCTION=false
```

```bash
# Start backend server
npm run dev
```

✅ Backend sekarang berjalan di `http://localhost:5000`

### 4. Frontend Setup (Terminal Baru)
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

**Konfigurasi .env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_TRIPAY_IS_PRODUCTION=false
```

```bash
# Start frontend server
npm run dev
```

✅ Frontend sekarang berjalan di `http://localhost:3000`

## 🎯 Testing Website

### 1. Akses Website
Buka browser dan kunjungi: `http://localhost:3000`

### 2. Test dengan Akun Dummy
**Admin Account:**
- Email: `admin@donasi.com`
- Password: `admin123`

**User Account:**
- Email: `john@example.com`
- Password: `user123`

### 3. Test API dengan cURL
```bash
# Health check
curl http://localhost:5000/health

# Login test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@donasi.com","password":"admin123"}'
```

## 📧 Setup Email (Gmail)

### 1. Enable 2-Factor Authentication
1. Login ke Gmail account
2. Pergi ke Google Account settings
3. Enable 2-Factor Authentication

### 2. Generate App Password
1. Pergi ke Security settings
2. Klik "App passwords"
3. Generate password untuk "Mail"
4. Copy password dan masukkan ke `SMTP_PASS` di .env

### 3. Test Email
```bash
# Register user baru untuk test email
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"your-test-email@gmail.com",
    "password":"Test123!",
    "full_name":"Test User"
  }'
```

## 💳 Setup Tripay (Payment Gateway)

### 1. Buat Akun Tripay
1. Daftar di [Tripay Sandbox](https://tripay.co.id/)
2. Login ke merchant panel
3. Copy merchant code dan API key

### 2. Konfigurasi Webhook
1. Di merchant panel, setting webhook URL: `http://localhost:5000/api/donations/webhook`
2. Copy private key untuk signature validation

### 3. Test Payment
1. Buat campaign di website
2. Test donasi dengan nominal kecil
3. Check webhook di logs

## 🐞 Troubleshooting

### Database Connection Error
```bash
# Check MySQL service
sudo systemctl status mysql
sudo systemctl start mysql

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### NPM Install Issues
```bash
# Clear cache
npm cache clean --force

# Delete node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Email Not Working
1. ✅ Check SMTP credentials
2. ✅ Enable "Less secure app access" (untuk Gmail lama)
3. ✅ Gunakan App Password (recommended)
4. ✅ Check firewall/antivirus

## 📁 File Structure Penting

```
donation-website/
├── backend/
│   ├── .env                 # ⚠️ Jangan commit file ini
│   ├── src/index.ts         # Entry point backend
│   └── logs/               # Log files akan muncul di sini
├── frontend/
│   ├── .env.local          # ⚠️ Jangan commit file ini
│   └── src/app/            # Next.js app directory
├── database/
│   ├── schema.sql          # Database structure
│   └── seeds.sql           # Sample data
└── uploads/                # Uploaded files (akan dibuat otomatis)
```

## 🔧 Development Commands

### Backend Commands
```bash
cd backend

npm run dev          # Development mode dengan auto-reload
npm run build        # Build TypeScript ke JavaScript
npm run start        # Production mode
npm test            # Run tests (jika ada)
```

### Frontend Commands
```bash
cd frontend

npm run dev          # Development mode dengan hot reload
npm run build        # Build untuk production
npm run start        # Production mode
npm run lint         # Check code quality
npm run type-check   # TypeScript type checking
```

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Backend production .env
NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
TRIPAY_IS_PRODUCTION=true
# ... other production configs

# Frontend production .env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_FRONTEND_URL=https://yourdomain.com
```

### 2. Build untuk Production
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

### 3. Process Manager (PM2)
```bash
# Install PM2
npm install -g pm2

# Start backend dengan PM2
cd backend
pm2 start dist/index.js --name "donation-backend"

# Start frontend dengan PM2
cd frontend
pm2 start npm --name "donation-frontend" -- start
```

## 🔐 Security Checklist

### Development
- ✅ Jangan commit file .env
- ✅ Gunakan HTTPS di production
- ✅ Update dependencies secara berkala
- ✅ Use strong JWT secrets

### Production
- ✅ Firewall configuration
- ✅ SSL certificates
- ✅ Database security
- ✅ Regular backups
- ✅ Monitor logs

## 📊 Monitoring & Logs

### Log Locations
```bash
# Backend logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log

# PM2 logs
pm2 logs donation-backend
pm2 logs donation-frontend
```

### Health Checks
```bash
# API health
curl http://localhost:5000/health

# Database connection
curl http://localhost:5000/api/campaigns?limit=1
```

## 🆘 Getting Help

### Common Issues
1. **"Cannot connect to database"** - Check MySQL service & credentials
2. **"Port already in use"** - Kill existing process atau gunakan port lain
3. **"Module not found"** - Run `npm install` lagi
4. **"Email not sending"** - Check SMTP configuration
5. **"Payment webhook error"** - Check Tripay configuration

### Debug Mode
```bash
# Backend dengan debug logs
DEBUG=* npm run dev

# Frontend dengan verbose logs
npm run dev -- --verbose
```

### Support Resources
- 📖 **Documentation**: README.md dan IMPLEMENTATION_SUMMARY.md
- 🐛 **Issues**: Check error logs dan console
- 💬 **Community**: Stack Overflow untuk framework-specific issues

---

## 🎉 Success!

Jika semua langkah di atas berhasil, Anda sekarang memiliki:

✅ **Backend API** berjalan di port 5000
✅ **Frontend website** berjalan di port 3000  
✅ **Database** dengan sample data
✅ **Email system** untuk notifications
✅ **Payment gateway** ready untuk testing

**Next Steps:**
1. Customize design sesuai branding Anda
2. Setup domain dan hosting untuk production
3. Configure monitoring dan backup
4. Add additional features sesuai kebutuhan

**Happy coding! 🚀**