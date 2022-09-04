import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text,name) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
    //   service: process.env.SERVICE,
      port: 2525 ,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: `<h1>Email Confirmation</h1>
      <h2>Hello ${name}</h2>
      <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
      <a href="${text}"> Click here</a>
      </div>`,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

export default sendEmail;