import { Request, Response, NextFunction } from 'express';
import { ErrorCode } from './error-code';
import { ErrorException } from './error-exception';
import { ErrorModel } from './error-model';
import { logger } from '../../logging/logger';
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    logger.error('Error handling middleware called.');
    logger.error('Path:' + req.path);
    logger.error('Error occured:' + err);
    if (err instanceof ErrorException) {
        logger.error('Error is known.');
        res.status(err.status).send(err);
    } else {
        // For unhandled errors.
        res.status(500).send({
            code: ErrorCode.UnknownError,
            status: 500,
        } as ErrorModel);
    }
};
