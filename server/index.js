const express = require("express");
const api = require("./src/routes/api");
const errorController = require("./src/controllers/errorController");
const all = require("./src/middlewares/all");
require("./src/models/Repository");
port = process.env.PORT || 8000;
host = process.env.HOST || "0.0.0.0";
app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(all);
app.use(api);
app.use(errorController);

app.listen(port, host, () => {
    console.log(`api server listen on ${port}`)
})
