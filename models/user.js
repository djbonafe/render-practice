// models/userModel.js (example with Mongoose)
const mongoose = require('mongoose');


//this creates a collection in mongo/ collection: a nosql version of a table
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  // add more fields like name, roles, etc.
});

module.exports = mongoose.model('User', userSchema);
