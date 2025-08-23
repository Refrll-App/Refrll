import nodemailer from 'nodemailer';


export const sendEmail = async ({ to, subject, text, html }) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
     port: 465,          // ✅ Secure port
  secure: true,       // ✅ Use SSL
    auth: {
      user: process.env.EMAIL_FROM, // e.g. support@refrll.com
      pass: process.env.EMAIL_PASS, // app password
    },
  });


  // Test SMTP
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Error:', error);
  } else {
    console.log('✅ SMTP is ready to send mail');
  }
});

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });




};


