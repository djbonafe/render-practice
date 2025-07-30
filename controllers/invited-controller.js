const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Invited = require('../models/invited');
const HttpError = require('../models/http-error');

const getAllInvited = async (req, res, next) => {
  let allInvited;
  try {
    allInvited = await Invited.find();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not fetch invitees.', 500);
    return next(error);
  }

  res.json({
    allInvited: allInvited.map(invited =>
      invited.toObject({ getters: true })
    ),
  });
};

const getInvitedById = async (req, res, next) => {
  const invId = req.params.invId;

  let invited;
  try {
    invited = await Invited.findById(invId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find the invitee', 500);
    return next(error);
  }

  if (!invited) {
    const error = new HttpError('Could not find invited for the provided id.', 404);
    return next(error);
  }

  res.json({ invited: invited.toObject({ getters: true }) });
};

const createInvited = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new HttpError(`Invalid inputs: ${errorMessages}`, 422));
  }

  const { firstName, lastName, coming, specialRequest } = req.body;

  const createdInvited = new Invited({
    firstName,
    lastName,
    coming,
    specialRequest
  });

  try {
    await createdInvited.save();
  } catch (err) {
    console.error('[Invited Save Error]:', err);
    return next(new HttpError('Creating invited failed, please try again.', 500));
  }

  res.status(201).json({ invited: createdInvited });
};

const deleteInvited = async (req, res, next) => {
  const invId = req.params.invId;
  let invited;

  try {
    invited = await Invited.findByIdAndDelete(invId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete the invited.', 500);
    return next(error);
  }

  if (!invited) {
    const error = new HttpError('Could not find invited for the provided id.', 404);
    return next(error);
  }

  res.status(200).json({ message: 'Invited deleted.' });
};

const editInvited = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new HttpError(`Invalid inputs: ${errorMessages}`, 422));
  }

  const invId = req.params.invId;
  const { firstName, lastName, coming, specialRequest } = req.body;

  let updatedInvited;
  try {
    updatedInvited = await Invited.findByIdAndUpdate(
      invId,
      {
        firstName,
        lastName,
        coming,
        specialRequest
      },
      { new: true, runValidators: true }
    );

    if (!updatedInvited) {
      return next(new HttpError('Invitee not found.', 404));
    }
    console.log("🚀 specialRequests from body:", req.body.specialRequest);

    res.status(200).json({ message: 'Invited updated.', invited: updatedInvited });
  } catch (err) {
    console.error('[Update Invited Error]:', err);
    return next(new HttpError('Updating invited failed, please try again.', 500));
  }
};

exports.createInvited = createInvited;
exports.getInvitedById = getInvitedById;
exports.getAllInvited = getAllInvited;
exports.deleteInvited = deleteInvited;
exports.editInvited = editInvited;
