
exports.sendSuccess = (req, res) => (result) => {
    const response = Object.assign({
        success: true,
    }, result)

    console.log(response.response.data)
    const {status} = response

    delete response.status

    // if (totalTime) {
    //     res.set('x-query-time', totalTime)
    // }

    return res.status(status || 200).send(response)
}

exports.sendError = (req, res) => (error) => {
    const message = typeof error === 'string' ? error : error.data.error || ''
    const status = error.status || 400
    const reson = error.reson || false

    console.log("REQUEST_ERROR", error)

    const response = {
        success: false,
        message,
        errors: error,
    }

    if (reson) {
        response.reson = reson
    }

    if (totalTime) {
        res.set('x-query-time', totalTime)
    }

    res.status(status).send(response)
}
