const mongoose = require("mongoose");
const UserSchema = require("./User");

let mongo_uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017"
mongoose.connect(mongo_uri,{useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
