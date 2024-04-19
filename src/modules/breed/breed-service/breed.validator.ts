import Joi from 'joi';
import { createInboundValidatorByJoi } from '../../../system/factories';

export const breedCreateValidator = createInboundValidatorByJoi(
    Joi.object({
        breed_name: Joi.string().required(),
        appearance: Joi.string().required(),
        behavior: Joi.string().required(),
        common_health_issues: Joi.string().required(),
        diet: Joi.array().items(Joi.string()),
        breedImages: Joi.array().items(Joi.string()),
        description: Joi.string().required(),
    }),
);

export const breedUpdateValidator = createInboundValidatorByJoi(
    Joi.object({
        breed_name: Joi.string(),
        appearance: Joi.string(),
        behavior: Joi.string(),
        common_health_issues: Joi.string(),
        diet: Joi.array().items(Joi.string()),
        breedImages: Joi.array().items(Joi.string()),
        description: Joi.string(),
    }),
);
