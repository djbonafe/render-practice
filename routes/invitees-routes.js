const express = require('express'); 
const {check} = require('express-validator'); 

const inviteesController = require('../controllers/invitees-controller')

const router = express.Router(); 

router.get('/:inviteeid', inviteesController.getInviteeById); 
router.post('/', inviteesController.createInvitee); 

module.exports = router