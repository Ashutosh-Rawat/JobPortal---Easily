const getError = (req, res) => {
    const { err } = req.session
    console.log(err)
    req.session.err = null
    return res.render('err-page', {
        includeHeader: false,
        err
    })
}

export default getError
