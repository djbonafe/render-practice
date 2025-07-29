const express = require('express'); 
const { check } = require('express-validator');
const inviteesController = require('../controllers/invitees-controller');

const router = express.Router(); 

router.get('/:invId', inviteesController.getInviteeById); 
router.get('/', inviteesController.getInvitees);

router.post(
  '/',
  [
    check('firstName').not().isEmpty().isAlphanumeric('en-US', { ignore: ' ' }),
    check('lastName').not().isEmpty().isAlphanumeric('en-US', { ignore: ' ' }),
    check('coming').not().isEmpty()
  ],
  inviteesController.createInvitee
);

router.patch(
  '/:invId',
  [
    check('firstName').optional().isAlphanumeric(),
    check('lastName').optional().isAlphanumeric(),
    check('coming').optional().isBoolean(),
    check('specialRequests').optional().isString()
  ],
  inviteesController.editInvitee
);

router.delete('/:invId', inviteesController.deleteInvitee);

module.exports = router;
