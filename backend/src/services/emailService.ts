import nodemailer from 'nodemailer';
import logger from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    verificationToken: string
  ): Promise<void> {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verifikasi Email Anda - DonasiKu',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verifikasi Email</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🤝 DonasiKu</h1>
                <h2>Verifikasi Email Anda</h2>
              </div>
              <div class="content">
                <p>Halo <strong>${name}</strong>,</p>
                <p>Terima kasih telah mendaftar di DonasiKu! Untuk mengaktifkan akun Anda, silakan klik tombol di bawah ini:</p>
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Verifikasi Email</a>
                </div>
                <p>Atau salin dan tempel link berikut di browser Anda:</p>
                <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
                <p><strong>Link ini akan kadaluarsa dalam 24 jam.</strong></p>
                <p>Jika Anda tidak mendaftar di DonasiKu, abaikan email ini.</p>
                <p>Terima kasih,<br>Tim DonasiKu</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 DonasiKu. Platform donasi terpercaya.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string
  ): Promise<void> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Reset Password Anda - DonasiKu',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
              .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🤝 DonasiKu</h1>
                <h2>Reset Password</h2>
              </div>
              <div class="content">
                <p>Halo <strong>${name}</strong>,</p>
                <p>Kami menerima permintaan untuk reset password akun Anda. Klik tombol di bawah ini untuk membuat password baru:</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                <p>Atau salin dan tempel link berikut di browser Anda:</p>
                <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
                <div class="warning">
                  <strong>⚠️ Penting:</strong>
                  <ul>
                    <li>Link ini akan kadaluarsa dalam 1 jam</li>
                    <li>Jika Anda tidak meminta reset password, abaikan email ini</li>
                    <li>Untuk keamanan, jangan bagikan link ini kepada siapapun</li>
                  </ul>
                </div>
                <p>Terima kasih,<br>Tim DonasiKu</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 DonasiKu. Platform donasi terpercaya.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendDonationConfirmation(
    email: string,
    donorName: string,
    campaignTitle: string,
    amount: number,
    donationId: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Konfirmasi Donasi Anda - DonasiKu',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Konfirmasi Donasi</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #4ecdc4 0%, #26d0ce 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .donation-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4ecdc4; }
              .amount { font-size: 24px; font-weight: bold; color: #4ecdc4; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🤝 DonasiKu</h1>
                <h2>Terima Kasih atas Donasi Anda!</h2>
              </div>
              <div class="content">
                <p>Halo <strong>${donorName}</strong>,</p>
                <p>Donasi Anda telah berhasil diterima dan sangat berarti untuk membantu sesama. Berikut detail donasi Anda:</p>
                
                <div class="donation-details">
                  <h3>Detail Donasi</h3>
                  <p><strong>ID Donasi:</strong> ${donationId}</p>
                  <p><strong>Campaign:</strong> ${campaignTitle}</p>
                  <p><strong>Jumlah Donasi:</strong> <span class="amount">Rp ${amount.toLocaleString('id-ID')}</span></p>
                  <p><strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>

                <p>Donasi Anda akan langsung disalurkan kepada yang membutuhkan. Anda dapat memantau progress campaign melalui website kami.</p>
                
                <p><em>"Barang siapa yang menghilangkan kesusahan seorang mukmin dari kesusahan-kesusahan dunia, niscaya Allah akan menghilangkan kesusahannya pada hari kiamat."</em> - HR. Muslim</p>
                
                <p>Terima kasih atas kebaikan hati Anda,<br>Tim DonasiKu</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 DonasiKu. Platform donasi terpercaya.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Donation confirmation email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending donation confirmation email:', error);
      throw new Error('Failed to send donation confirmation email');
    }
  }

  async sendCampaignApprovalEmail(
    email: string,
    campaignerName: string,
    campaignTitle: string,
    isApproved: boolean,
    rejectionReason?: string
  ): Promise<void> {
    try {
      const subject = isApproved 
        ? 'Campaign Anda Telah Disetujui - DonasiKu'
        : 'Campaign Anda Memerlukan Revisi - DonasiKu';

      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: email,
        subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Status Campaign</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: ${isApproved ? 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)' : 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)'}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .status-box { background: ${isApproved ? '#d4edda' : '#f8d7da'}; border: 1px solid ${isApproved ? '#c3e6cb' : '#f5c6cb'}; color: ${isApproved ? '#155724' : '#721c24'}; padding: 15px; border-radius: 5px; margin: 15px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🤝 DonasiKu</h1>
                <h2>${isApproved ? '✅ Campaign Disetujui' : '⚠️ Campaign Memerlukan Revisi'}</h2>
              </div>
              <div class="content">
                <p>Halo <strong>${campaignerName}</strong>,</p>
                
                ${isApproved ? `
                  <div class="status-box">
                    <h3>🎉 Selamat!</h3>
                    <p>Campaign Anda "<strong>${campaignTitle}</strong>" telah disetujui dan sekarang sudah aktif di platform DonasiKu.</p>
                  </div>
                  <p>Campaign Anda sekarang dapat menerima donasi dari para donatur. Anda dapat:</p>
                  <ul>
                    <li>Memantau progress donasi melalui dashboard</li>
                    <li>Memberikan update kepada donatur</li>
                    <li>Melihat daftar donatur dan pesan mereka</li>
                  </ul>
                  <p>Semoga campaign Anda berhasil mencapai target! 🎯</p>
                ` : `
                  <div class="status-box">
                    <h3>📝 Perlu Revisi</h3>
                    <p>Campaign Anda "<strong>${campaignTitle}</strong>" memerlukan beberapa perbaikan sebelum dapat disetujui.</p>
                  </div>
                  ${rejectionReason ? `
                    <p><strong>Alasan penolakan:</strong></p>
                    <p style="background: #fff; padding: 15px; border-left: 4px solid #ff6b6b; margin: 15px 0;">${rejectionReason}</p>
                  ` : ''}
                  <p>Silakan edit campaign Anda melalui dashboard dan submit ulang untuk review.</p>
                `}
                
                <p>Terima kasih,<br>Tim DonasiKu</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 DonasiKu. Platform donasi terpercaya.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Campaign ${isApproved ? 'approval' : 'rejection'} email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending campaign status email:', error);
      throw new Error('Failed to send campaign status email');
    }
  }
}

export const emailService = new EmailService();