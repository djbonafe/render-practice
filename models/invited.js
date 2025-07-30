const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema; 


const invitedSchema = new Schema({
    firstName: {type: String, required: true}, 
    lastName: {type: String, required: true}, 
    coming: {type: Boolean, required: true }, 
    specialRequest: {type: String}

})

invitedSchema.plugin(uniqueValidator); 
module.exports = mongoose.model('Invited', invitedSchema)