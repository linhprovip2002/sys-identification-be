import Joi from 'joi';
import { createInboundValidatorByJoi } from '../../../system/factories';

export const blogCreateDtoValidator = createInboundValidatorByJoi(
    Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        category: Joi.string(),
        shortContent: Joi.string(),
    }),
);

export const blogUpdateDtoValidator = createInboundValidatorByJoi(
    Joi.object({
        title: Joi.string(),
        content: Joi.string(),
        category: Joi.string(),
        shortContent: Joi.string(),
    }),
);
