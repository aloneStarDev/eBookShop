module.exports = (err, req, res, next) => {
    if (typeof (err) === "string") {
        if (res.statusCode >= 400 && res.statusCode < 500) {
            res.json({ ok: false, error: err });
            return;
        }
        console.log(err);
    } else {
        if (err.message.includes("JSON")) {
            res.status(400).json({ ok: false, error: "invalid json" })
            return;
        }
        res.status(500).json({ ok: false, error: "server error" })
        return;
    }
}