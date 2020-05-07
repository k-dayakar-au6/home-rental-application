const nodemailer = require("nodemailer");
const { YAHOO_EMAIL, YAHOO_PASSWORD } = process.env;

const transportOptions = {
  host: "smtp.mail.yahoo.com",
  port: 465,
  secure: true,
  debug: process.env.NODE_ENV === "development",
  auth: {
    user: YAHOO_EMAIL,
    pass: YAHOO_PASSWORD
  }
};

const mailTransport = nodemailer.createTransport(transportOptions);
const sendMailToUser = async (mode, email, token) => {
  const domainName = process.env.DOMAIN_NAME || `http://localhost:1234`;
  console.log("I am getting called", mode);
  let html = null;
  if (mode === "confirm")
    html = `
  <h1>Welcome to my application</h1>
  <p>Thanks for creating an account. Click 
    <a href=${domainName}/confirm/${token}>here</a> to confirm your account. Or copy paste ${domainName}/confirm/${token} to your browser.
  </p>
`;
  else if (mode === "reset")
    html = `<h1>Hi there.</h1>
<p>You have recently requested for a change in password. Click 
  <a href=${domainName}/reset/${token}>here</a> to reset your password. Or copy paste ${domainName}/reset/${token} to your browser. If you didnt initiate the request. Kindly ignore. Thanks :)
</p>`;
  try {
    await mailTransport.sendMail({
      from: YAHOO_EMAIL,
      to: email,
      subject:
        mode === "confirm" ? "Confirm your email" : "Reset your password",
      html
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = sendMailToUser;
