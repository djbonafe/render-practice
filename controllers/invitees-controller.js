const {validationResult} = require('express-validator'); 

const mongoose = require('mongoose')

const Invitee = require('../models/invitee'); 
const HttpError = require('../models/http-error');
const { ValidatorsImpl } = require('express-validator/lib/chain');

const getInvitees = async (req, res, next) => {
  let allInvitees;
  try {
    allInvitees = await Invitee.find();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not fetch invitees.', 500);
    return next(error);
  }

  res.json({
    invitees: allInvitees.map(invitee =>
      invitee.toObject({ getters: true })
    ),
  });
};


const getInviteeById = async (req, res, next) => {
    const invId = req.params.invId; 

    let invitee; 
    try{
    await Invitee.findById(inviteeId)
    }catch(err){
        const error = new HttpError('Something went wrong, could not find the invitee', 500)
     return next(error)
    }

    if (!invitee) {
    const error = new HttpError(
      'Could not find invitee for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ invitee: invitee.toObject({ getters: true }) });

}

const createInvitee = async (req, res, next) => {
    const errors = validationResult(req); 
if(!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    console.log(req.body)
    console.log("its logging the error")
    return next(
      new HttpError(`Invalid inputs: ${errorMessages}`, 422)
      
    );
  }
    const {firstName, lastName, coming, specialRequests} = req.body;
    
    const createdInvitee = new Invitee({
        firstName, 
        lastName, 
        coming, 
        specialRequests
    })

    try{
        await createdInvitee.save(); 
        
    }catch (err) {
  console.error('[Invitee Save Error]:', err);
  return next(new HttpError('Creating invitee failed, please try again.', 500));
}
    res.status(201).json({invitee: createdInvitee})

}

const deleteInvitee = async (req, res, next) => {
  const invId = req.params.invId;
  let invitee;

  try {
    invitee = await Invitee.findByIdAndDelete(invId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete the invitee.', 500);
    return next(error);
  }

  if (!invitee) {
    const error = new HttpError(
      'Could not find invitee for the provided id.',
      404
    );
    return next(error);
  }
res.status(200).json({ message: 'Invitee deleted.' });

};


const editInvitee = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new HttpError(`Invalid inputs: ${errorMessages}`, 422));
  }

  const invId = req.params.invId;
  const { firstName, lastName, coming, specialRequests } = req.body;

  let updatedInvitee;
  try {
    updatedInvitee = await Invitee.findByIdAndUpdate(
      invId,
      {
        firstName,
        lastName,
        coming,
        specialRequests
      },
      { new: true, runValidators: true }
    );
  } catch (err) {
    console.error('[Update Invitee Error]:', err);
    return next(new HttpError('Updating invitee failed, please try again.', 500));
  }

}


exports.createInvitee = createInvitee; 
exports.getInviteeById = getInviteeById; 
exports.getInvitees = getInvitees; 
exports.deleteInvitee = deleteInvitee; 
exports.editInvitee = editInvitee;