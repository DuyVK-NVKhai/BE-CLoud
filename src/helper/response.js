const { response } = require("express")

exports.sendSuccess = (req, res) => (result) => {
    const {status, data} = result
    const response = {
        success: true,
        data
    }
    return res.status(status || 200).send(response)
}

exports.sendError = (req, res) => (error) => {
    const message = typeof error === 'string' ? error : error.message || ''
    const status = error.response.status || 400

    const response = {
        success: false,
        message,
    }

    res.status(status).send(response)
}
