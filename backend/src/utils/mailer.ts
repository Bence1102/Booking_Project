import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP Kapcsolódási hiba:', error);
  } else {
    console.log('🚀 SMTP Szerver készen áll az emailek küldésére!');
  }
});

export const sendRegisterEmail = async (toEmail: string, name: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"ReserveHub" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Sikeres Regisztráció! - ReserveHub',
      html: `
        <div style="font-family: sans-serif; padding: 24px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1; margin-bottom: 16px;">Üdvözlünk a ReserveHub-on, ${name}! 👋</h2>
          <p style="font-size: 16px; line-height: 1.5;">Köszönjük, hogy regisztráltál a ReserveHub rendszerében.</p>
          <p style="font-size: 16px; line-height: 1.5;">Fiókod sikeresen létrejött. Most már beléphetsz, és azonnal lefoglalhatod a számodra szükséges erőforrásokat!</p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">Ez egy automatikus üzenet, kérjük ne válaszolj rá.</p>
        </div>
      `,
    });
    console.log('✅ Regisztrációs email elküldve! Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Hiba a regisztrációs email küldésekor:', error);
  }
};

export const sendBookingEmail = async (
  toEmail: string,
  resourceName: string,
  startTime: Date,
  endTime: Date
) => {
  try {
    const formattedStart = new Date(startTime).toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const formattedEnd = new Date(endTime).toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const info = await transporter.sendMail({
      from: `"ReserveHub" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Foglalás Megerősítése - ReserveHub',
      html: `
        <div style="font-family: sans-serif; padding: 24px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; margin-bottom: 16px;">Sikeres foglalás! 🎉</h2>
          <p style="font-size: 16px; line-height: 1.5;">A foglalásodat rögzítettük a rendszerben az alábbi részletekkel:</p>
          
          <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 6px 0;"><strong>Erőforrás:</strong> <span style="color: #38bdf8;">${resourceName}</span></p>
            <p style="margin: 6px 0;"><strong>Kezdés:</strong> ${formattedStart}</p>
            <p style="margin: 6px 0;"><strong>Befejezés:</strong> ${formattedEnd}</p>
          </div>

          <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">ReserveHub foglalási rendszer</p>
        </div>
      `,
    });
    console.log('✅ Foglalási email elküldve! Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Hiba a foglalási email küldésekor:', error);
  }
};