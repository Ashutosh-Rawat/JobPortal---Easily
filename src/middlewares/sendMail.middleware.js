import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
const senderMail = process.env.HOST_MAIL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderMail,
        pass: process.env.HOST_PASSWORD
    }
})


const ejsViewFilename = 'confirmationMail'
const imgSrc = 'https://cdn.pixabay.com/photo/2016/11/07/13/04/yoga-1805784_1280.png'

const sendMail = (req, res, next) => {
    const { applicantName, applicantEmail, companyName, jobDesign } = res.locals.mailInfo

    res.render(ejsViewFilename, {
        imgSrc, applicantName, companyName, jobDesign
    }, (err, html) => {
        if (err) {
            console.error('Error rendering email template:', err)
            return next(err)
        }

        const mailOptions = {
            from: senderMail,
            to: applicantEmail,
            subject: 'Job application sent successfully',
            html: html
        }

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error('Error sending email:', error)
                return next(error)
            }
            console.log('Email sent successfully!')
            res.redirect('/jobs')
        })
    })
}

export default sendMail
