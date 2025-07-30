const express = require('express'); 
const { check } = require('express-validator');
const invitedController = require('../controllers/invited-controller');

const router = express.Router(); 

router.get('/:invId', invitedController.getInvitedById); 
router.get('/', invitedController.getAllInvited);

router.post(
  '/',
  [
    check('firstName').not().isEmpty().isAlphanumeric('en-US', { ignore: ' ' }),
    check('lastName').not().isEmpty().isAlphanumeric('en-US', { ignore: ' ' }),
    check('coming').not().isEmpty()
  ],
  invitedController.createInvited
);

router.patch(
  '/:invId',
  [
    check('firstName').optional().isAlphanumeric(),
    check('lastName').optional().isAlphanumeric(),
    check('coming').optional().isBoolean(),
    check('specialRequests').optional().isString()
  ],
  invitedController.editInvited
);

router.delete('/:invId', invitedController.deleteInvited);

module.exports = router;
