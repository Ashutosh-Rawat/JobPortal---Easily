const getError = (req, res) => {
    const { err } = req.session
    req.session.err = null
    return res.render('err-page', {
        includeHeader: false,
        err
    })
}

export default getError
