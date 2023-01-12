const allowedOrigins = [
    'set list of allowed origin here'
]

exports.originMiddle = async (req, res, next) => {
    let origin = req.headers['origin'];
    var index = allowedOrigins.indexOf(origin);
    if (index > -1) {
        next()
    }
    else {
        return res.json({ success: 401, msg: "Unauthorized Request", origin1: origin, origin: allowedOrigins });
    }
}