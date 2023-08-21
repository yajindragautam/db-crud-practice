import { checkSchema } from 'express-validator';

export const emailValidator = checkSchema({
    email: {
        isEmpty:{
            errorMessage:"Email cannot be empty..!"
        },
        isEmail:{
            errorMessage:"Invalid Email Format..!"
        }
    },
})
