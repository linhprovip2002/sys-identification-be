import Joi from 'joi';
import { createInboundValidatorByJoi } from '../../../../system/factories';

const EIGHT_CHAR_CONTAINS_ONE_LETTER_AND_ONE_NUMBER_REGEX =
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const loginDtoValidator = createInboundValidatorByJoi(
    Joi.object({
        email: Joi.string().email(),
        password: Joi.string()
            .regex(EIGHT_CHAR_CONTAINS_ONE_LETTER_AND_ONE_NUMBER_REGEX)
            .message('Password should contains 8 chars with 1 char and 1 num'),
    }),
);

export const registerDtoValidator = createInboundValidatorByJoi(
    Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email(),
        password: Joi.string()
            .regex(EIGHT_CHAR_CONTAINS_ONE_LETTER_AND_ONE_NUMBER_REGEX)
            .message('Password should contains 8 chars with 1 char and 1 num'),
    }),
);
