export class ApplicationError extends Error {
    constructor({ code = 500, message = 'An unexpected error occurred' }) {
        super(message)
        this.code = code
        this.message = message
    }
}

const applicationErrorHandler = (err, req, res, next) => {
    if (err instanceof ApplicationError) {
        console.log(`url: ${req.url}`)
        console.error(`[${new Date().toISOString()}] Code: ${err.code}, Message: ${err.message}`)
        req.session.err = err
        res.status(err.code).redirect('/err')
    } else {
        console.error(`[${new Date().toISOString()}] Unexpected Error: ${err.message}`)
        req.session.err = new ApplicationError(500, 'Unexpected Server Error')
        res.status(500).redirect('/err')
    }
}

export default applicationErrorHandler
