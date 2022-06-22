const express = require("express");
const api = require("./src/routes/api");
const errorController = require("./src/controllers/errorController");
const all = require("./src/middlewares/all");
require("./src/models/Repository");
port = process.env.port || 8000;
app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(all);
app.use(api);
app.use(errorController);

app.listen(8000, "0.0.0.0", port, () => {
    console.log(`api server listen on ${port}`)
})
