const mongoose = require("mongoose");
const UserSchema = require("./User");
mongoose.connect('mongodb://127.0.0.1:27017/eshop?authSource=admin',{useNewUrlParser: true, useUnifiedTopology: true});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
