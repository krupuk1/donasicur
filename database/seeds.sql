-- Seeds data untuk Website Donasi
USE donation_website;

-- Insert categories
INSERT INTO categories (name, description, icon) VALUES
('Kesehatan', 'Bantuan untuk biaya pengobatan dan kesehatan', 'medical'),
('Pendidikan', 'Bantuan untuk biaya sekolah dan pendidikan', 'education'),
('Bencana Alam', 'Bantuan untuk korban bencana alam', 'disaster'),
('Kemanusiaan', 'Bantuan kemanusiaan dan sosial', 'humanity'),
('Lingkungan', 'Kampanye untuk pelestarian lingkungan', 'environment'),
('Hewan', 'Bantuan untuk kesejahteraan hewan', 'animal'),
('Teknologi', 'Kampanye untuk pengembangan teknologi', 'technology'),
('Seni & Budaya', 'Bantuan untuk seni dan pelestarian budaya', 'culture');

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, full_name, phone, role, is_verified) VALUES
('admin', 'admin@donasi.com', '$2b$10$8K1p/a0dJd/n0Wjt9x5aWeTZ7/3z5GHtZNvNkR4l6LWz8EeCrqLK2', 'Administrator', '081234567890', 'admin', TRUE);

-- Insert dummy users (password: user123)
INSERT INTO users (username, email, password, full_name, phone, is_verified) VALUES
('john_doe', 'john@example.com', '$2b$10$8K1p/a0dJd/n0Wjt9x5aWeTZ7/3z5GHtZNvNkR4l6LWz8EeCrqLK2', 'John Doe', '081234567891', TRUE),
('jane_smith', 'jane@example.com', '$2b$10$8K1p/a0dJd/n0Wjt9x5aWeTZ7/3z5GHtZNvNkR4l6LWz8EeCrqLK2', 'Jane Smith', '081234567892', TRUE),
('ahmad_rizki', 'ahmad@example.com', '$2b$10$8K1p/a0dJd/n0Wjt9x5aWeTZ7/3z5GHtZNvNkR4l6LWz8EeCrqLK2', 'Ahmad Rizki', '081234567893', TRUE),
('siti_nurhaliza', 'siti@example.com', '$2b$10$8K1p/a0dJd/n0Wjt9x5aWeTZ7/3z5GHtZNvNkR4l6LWz8EeCrqLK2', 'Siti Nurhaliza', '081234567894', TRUE),
('budi_santoso', 'budi@example.com', '$2b$10$8K1p/a0dJd/n0Wjt9x5aWeTZ7/3z5GHtZNvNkR4l6LWz8EeCrqLK2', 'Budi Santoso', '081234567895', TRUE);

-- Insert sample campaigns
INSERT INTO campaigns (user_id, category_id, title, slug, description, story, target_amount, current_amount, image_url, status, start_date, end_date, is_urgent) VALUES
(2, 1, 'Bantu Operasi Jantung Adik Kecil Kami', 'bantu-operasi-jantung-adik-kecil-kami', 'Adik kecil kami membutuhkan operasi jantung segera. Mari kita bantu bersama-sama.', 
'Adik kecil kami, Aisyah (5 tahun) menderita penyakit jantung bawaan yang memerlukan operasi segera. Keluarga kami sudah berusaha mengumpulkan dana tapi masih sangat kurang. Dokter mengatakan operasi harus dilakukan dalam 2 bulan ke depan. Kami sangat berharap bantuan dari teman-teman semua. Setiap rupiah yang terkumpul akan sangat berarti untuk kesembuhan Aisyah.', 
150000000, 45000000, '/images/campaigns/heart-surgery.jpg', 'active', '2024-01-01', '2024-03-31', TRUE),

(3, 2, 'Beasiswa untuk Anak Yatim Piatu', 'beasiswa-untuk-anak-yatim-piatu', 'Program beasiswa untuk 50 anak yatim piatu agar bisa melanjutkan pendidikan.', 
'Kami dari Yayasan Pendidikan Harapan ingin memberikan beasiswa untuk 50 anak yatim piatu di daerah terpencil. Mereka sangat bersemangat belajar tapi terhalang biaya. Dengan beasiswa ini, mereka bisa mendapat seragam, buku, dan biaya sekolah selama 1 tahun. Mari kita wujudkan mimpi mereka untuk mengenyam pendidikan yang layak.', 
75000000, 23000000, '/images/campaigns/scholarship.jpg', 'active', '2024-01-15', '2024-04-15', FALSE),

(4, 3, 'Bantuan Korban Banjir Kalimantan', 'bantuan-korban-banjir-kalimantan', 'Bantuan darurat untuk korban banjir di Kalimantan Selatan.', 
'Banjir besar di Kalimantan Selatan telah melanda ribuan rumah. Banyak keluarga yang kehilangan tempat tinggal dan harta benda. Mereka sangat membutuhkan bantuan berupa makanan, air bersih, obat-obatan, dan tempat penampungan sementara. Setiap bantuan dari Anda akan langsung disalurkan kepada para korban melalui relawan terpercaya di lokasi.', 
200000000, 87000000, '/images/campaigns/flood-help.jpg', 'active', '2024-02-01', '2024-05-01', TRUE),

(5, 4, 'Rumah Singgah untuk Anak Jalanan', 'rumah-singgah-untuk-anak-jalanan', 'Membangun rumah singgah yang aman dan nyaman untuk anak-anak jalanan.', 
'Kami ingin membangun rumah singgah untuk anak-anak jalanan di Jakarta. Rumah ini akan menjadi tempat mereka berlindung, belajar, dan mendapat pendampingan. Target kami adalah bisa menampung 30 anak dan memberikan mereka pendidikan non-formal, pelatihan keterampilan, dan kasih sayang yang mereka butuhkan. Mari bersama-sama memberikan masa depan yang lebih baik untuk mereka.', 
300000000, 125000000, '/images/campaigns/street-children.jpg', 'active', '2024-01-20', '2024-06-20', FALSE),

(6, 5, 'Tanam 1000 Pohon untuk Bumi', 'tanam-1000-pohon-untuk-bumi', 'Program penanaman 1000 pohon untuk mengurangi polusi udara.', 
'Global warming semakin mengancam bumi kita. Salah satu cara sederhana yang bisa kita lakukan adalah menanam pohon. Kami menargetkan penanaman 1000 pohon di area yang gundul di sekitar Jakarta. Setiap pohon akan dirawat selama 2 tahun pertama. Mari kita berpartisipasi dalam menyelamatkan bumi untuk generasi mendatang.', 
50000000, 15000000, '/images/campaigns/plant-trees.jpg', 'active', '2024-02-10', '2024-05-10', FALSE);

-- Insert sample donations
INSERT INTO donations (campaign_id, user_id, donor_name, donor_email, amount, message, is_anonymous, payment_method, payment_status, net_amount, paid_at) VALUES
(1, 3, 'Jane Smith', 'jane@example.com', 500000, 'Semoga adik cepat sembuh', FALSE, 'BRIVA', 'paid', 495000, '2024-01-05 10:30:00'),
(1, 4, 'Ahmad Rizki', 'ahmad@example.com', 1000000, 'Untuk kesembuhan adik', FALSE, 'BCAVA', 'paid', 990000, '2024-01-07 14:20:00'),
(1, NULL, 'Donatur Anonymous', 'anonymous@example.com', 2000000, '', TRUE, 'OVO', 'paid', 1980000, '2024-01-10 09:15:00'),

(2, 2, 'John Doe', 'john@example.com', 300000, 'Pendidikan adalah kunci masa depan', FALSE, 'DANA', 'paid', 297000, '2024-01-20 16:45:00'),
(2, 5, 'Budi Santoso', 'budi@example.com', 250000, 'Semoga bermanfaat', FALSE, 'MANDIRI', 'paid', 247500, '2024-01-22 11:30:00'),

(3, 6, 'Siti Nurhaliza', 'siti@example.com', 750000, 'Bantuan untuk saudara kita di Kalimantan', FALSE, 'BNIVA', 'paid', 742500, '2024-02-05 13:20:00'),
(3, 2, 'John Doe', 'john@example.com', 500000, 'Semoga segera pulih', FALSE, 'SHOPEEPAY', 'paid', 495000, '2024-02-07 15:10:00'),

(4, 3, 'Jane Smith', 'jane@example.com', 400000, 'Untuk anak-anak jalanan', FALSE, 'LINKAJA', 'paid', 396000, '2024-02-01 12:00:00'),
(4, 4, 'Ahmad Rizki', 'ahmad@example.com', 600000, 'Semoga rumah singgah segera terealisasi', FALSE, 'BRIVA', 'paid', 594000, '2024-02-03 10:30:00'),

(5, 5, 'Budi Santoso', 'budi@example.com', 150000, 'Untuk bumi yang lebih hijau', FALSE, 'BCAVA', 'paid', 148500, '2024-02-15 14:20:00');

-- Insert sample comments
INSERT INTO comments (campaign_id, user_id, content) VALUES
(1, 3, 'Semoga adik cepat sembuh ya. Saya sudah berdonasi dan akan terus mendoakan kesembuhan adik.'),
(1, 4, 'Aamiin, semoga operasinya lancar dan berhasil. Tetap semangat keluarga!'),
(1, 5, 'Saya turut berdoa untuk kesembuhan. Kalau ada update progress mohon diinformasikan ya.'),

(2, 2, 'Program yang sangat mulia. Pendidikan memang hak setiap anak.'),
(2, 6, 'Sudah berdonasi. Semoga anak-anak bisa meraih cita-citanya.'),

(3, 3, 'Semoga bantuan segera sampai ke korban banjir. Tetap semangat!'),
(3, 4, 'Turut prihatin dengan musibah ini. Semoga segera pulih seperti sedia kala.'),

(4, 2, 'Anak jalanan juga berhak mendapat kasih sayang dan pendidikan. Support!'),
(4, 5, 'Program yang bagus. Semoga rumah singgahnya segera terwujud.'),

(5, 3, 'Bumi butuh lebih banyak pohon. Mari kita jaga lingkungan bersama-sama.'),
(5, 6, 'Sudah saatnya kita peduli dengan lingkungan. Saya ikut program ini.');

-- Insert payment methods (Tripay)
INSERT INTO payment_methods (code, name, category, is_active, fee_flat, fee_percent, min_amount, max_amount, icon_url) VALUES
-- Virtual Account
('BRIVA', 'BRI Virtual Account', 'virtual_account', TRUE, 4000, 0, 10000, 50000000, '/icons/bri.png'),
('BCAVA', 'BCA Virtual Account', 'virtual_account', TRUE, 4000, 0, 10000, 50000000, '/icons/bca.png'),
('BNIVA', 'BNI Virtual Account', 'virtual_account', TRUE, 4000, 0, 10000, 50000000, '/icons/bni.png'),
('MANDIRI', 'Mandiri Virtual Account', 'virtual_account', TRUE, 4000, 0, 10000, 50000000, '/icons/mandiri.png'),

-- E-Wallet
('OVO', 'OVO', 'ewallet', TRUE, 0, 2.5, 10000, 10000000, '/icons/ovo.png'),
('DANA', 'DANA', 'ewallet', TRUE, 0, 2.5, 10000, 10000000, '/icons/dana.png'),
('LINKAJA', 'LinkAja', 'ewallet', TRUE, 0, 2.5, 10000, 10000000, '/icons/linkaja.png'),
('SHOPEEPAY', 'ShopeePay', 'ewallet', TRUE, 0, 2.5, 10000, 10000000, '/icons/shopeepay.png'),

-- Retail
('ALFAMART', 'Alfamart', 'retail', TRUE, 2500, 0, 10000, 5000000, '/icons/alfamart.png'),
('INDOMARET', 'Indomaret', 'retail', TRUE, 2500, 0, 10000, 5000000, '/icons/indomaret.png'),

-- QRIS
('QRIS', 'QRIS', 'qris', TRUE, 0, 0.7, 1000, 10000000, '/icons/qris.png');

-- Insert site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'DonasiKu', 'string', 'Nama website'),
('site_description', 'Platform donasi terpercaya untuk berbagai kebutuhan', 'string', 'Deskripsi website'),
('site_logo', '/images/logo.png', 'string', 'URL logo website'),
('contact_email', 'contact@donasiku.com', 'string', 'Email kontak'),
('contact_phone', '021-1234-5678', 'string', 'Nomor telepon kontak'),
('min_donation', '10000', 'number', 'Minimum donasi (Rupiah)'),
('max_donation', '50000000', 'number', 'Maximum donasi (Rupiah)'),
('platform_fee_percent', '5', 'number', 'Platform fee dalam persen'),
('auto_approve_campaign', 'false', 'boolean', 'Auto approve campaign baru'),
('maintenance_mode', 'false', 'boolean', 'Mode maintenance'),

-- Tripay Settings
('tripay_merchant_code', 'T1234', 'string', 'Tripay merchant code'),
('tripay_api_key', 'DEV-xxx', 'string', 'Tripay API key'),
('tripay_private_key', 'xxx-private-key', 'string', 'Tripay private key'),
('tripay_is_production', 'false', 'boolean', 'Tripay production mode'),

-- Social Media
('facebook_url', 'https://facebook.com/donasiku', 'string', 'URL Facebook'),
('twitter_url', 'https://twitter.com/donasiku', 'string', 'URL Twitter'),
('instagram_url', 'https://instagram.com/donasiku', 'string', 'URL Instagram'),

-- SEO Settings
('meta_keywords', 'donasi, charity, bantuan, kemanusiaan, sosial', 'string', 'Meta keywords'),
('google_analytics', 'GA-XXXXXXXXXX', 'string', 'Google Analytics ID');