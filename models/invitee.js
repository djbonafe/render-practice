const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema; 


const inviteeSchema = new Schema({
    firstName: {type: String, required: true}, 
    lastName: {type: String, required: true}, 
    coming: {type: Boolean, required: true }, 
    specialRequests: {type: String}
})

inviteeSchema.plugin(uniqueValidator); 
module.exports = mongoose.model('Invitee', inviteeSchema)