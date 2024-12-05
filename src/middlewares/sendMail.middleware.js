import nodemailer from 'nodemailer'
import path from 'path'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'codingninjas2k16@gmail.com',
        pass: 'slwvvlczduktvhdj'
    }
})

const ejsViewFilename = 'confirmationMail'
const imgSrc = 'https://cdn.pixabay.com/photo/2016/11/07/13/04/yoga-1805784_1280.png'

const sendMail = (req, res, next) => {
    const { applicantName, applicantEmail, companyName, jobDesign } = res.locals.mailInfo
    
    res.render(ejsViewFilename, {
        includeHeader: false,
        applicantName, companyName, jobDesign, imgSrc
    }, (err, html) => {
        if (err) {
            return next(err)
        }

        const mailOptions = {
            from: 'codingninjas2k16@gmail.com',
            to: applicantEmail,
            subject: 'Job application sent successfully',
            html: html
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return next(error)
            }
            res.redirect('/jobs')
        })
    })
}

export default sendMail
