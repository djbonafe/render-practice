const {validationResult} = require('express-validator'); 

const mongoose = require('mongoose')

const Invitee = require('../models/invitee'); 
const HttpError = require('../models/http-error');
const { ValidatorsImpl } = require('express-validator/lib/chain');


const getInviteeById = async (req, res, next) => {
    const inviteeId = req.params.pid; 

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
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        )
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
        
    }catch(err){
        return next(new HttpError('Creating invitee failed, please try again.', 500))
    }

    res.status(201).json({invitee: createdInvitee})

}

exports.createInvitee = createInvitee; 
exports.getInviteeById = getInviteeById; 