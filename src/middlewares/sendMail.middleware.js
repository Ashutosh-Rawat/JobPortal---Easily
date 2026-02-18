import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const senderMail = process.env.HOST_MAIL;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: senderMail,
    pass: process.env.HOST_PASSWORD,
  },
  connectionTimeout: 10000,
});

const ejsViewFilename = "confirmationMail";

const sendMail = (req, res, next) => {
  const { applicantName, applicantEmail, companyName, jobDesign } =
    res.locals.mailInfo;

  res.render(
    ejsViewFilename,
    {
      applicantName,
      companyName,
      jobDesign,
      includeHeader: false,
    },
    (err, html) => {
      if (err) {
        console.error("Error rendering email template:", err);
        // Continue without crashing
        return res.redirect(`/jobs/${req.params.id}`);
      }

      const mailOptions = {
        from: senderMail,
        to: applicantEmail,
        subject: "Job application sent successfully",
        html: html,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(
            "Error sending email, but application saved:",
            error.message,
          );
          // Continue without crashing
          return res.redirect(`/jobs/${req.params.id}`);
        }

        console.log("Email sent successfully!");
        return res.redirect(`/jobs/${req.params.id}`);
      });
    },
  );
};

export default sendMail;
