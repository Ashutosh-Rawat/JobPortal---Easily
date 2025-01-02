export class ApplicationError extends Error {
    constructor({ code = 500, message = 'Something went wrong', stack = '' }) {
        super(message)
        this.code = code
        this.stack = stack
    }
}

const applicationErrorHandler = (err, req, res, next) => {
    const status = err.code || 500
    const message = err.message || 'Internal Server Error'
    console.error(`[${new Date().toISOString()}] ${message}, Stack Trace:`, err.stack)
    res.status(status).render('err-page', { message, includeHeader: false })
}

export default applicationErrorHandler
