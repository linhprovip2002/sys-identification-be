import Joi from 'joi';
import { createInboundValidatorByJoi } from '../../../system/factories';
import { OrderStatus } from '../../../system/model';

export const orderCreateValidator = createInboundValidatorByJoi(
    Joi.object({
        userId: Joi.string(),
        items: Joi.array().items(
            Joi.object({
                productId: Joi.string().required(),
                quantity: Joi.number().required(),
                variantOptions: Joi.string().required(),
                price: Joi.number().required(),
            })
        ),
        nameUser: Joi.string().required(),
        total: Joi.number().required(),
        phone: Joi.string().required().regex(/^[0-9]{10,11}$/),
        address: Joi.string().required(),
    }),
);

enum UserCancelOrder {
    USER_CANCELLED = 'USER_CANCELLED',
}

export const orderUpdateValidator = createInboundValidatorByJoi(
    Joi.object({
        userId: Joi.string(),
        nameUser: Joi.string(),
        items: Joi.array().items(
            Joi.object({
                productId: Joi.string(),
                quantity: Joi.number(),
                variantOptions: Joi.string(),
                price: Joi.number(),
            }),
        ),
        total: Joi.number(),
        phone: Joi.string(),
        status: Joi.string().valid(...Object.values(UserCancelOrder)),
        address: Joi.string(),
    }),
);
