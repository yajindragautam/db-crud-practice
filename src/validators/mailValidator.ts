import { check } from 'express-validator';

export const emailValidator = [
    check('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
];
  