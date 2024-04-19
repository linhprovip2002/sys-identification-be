import { Request, Response, NextFunction } from 'express';
import { userIdentityService } from '../../modules/auth/auth-service/service';
import { logger } from '../logging/logger';
import { HttpResponseBuilder } from '../builders/http-response.builder';

const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/docs',
    '/docs/*',
    '/swagger-ui.css',
    '/swagger-ui-bundle.js',
    '/swagger-ui-standalone-preset.js',
    '/swagger-ui-init.js',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/favicon.ico',
];

export const authenticationRouter = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    logger.info(`Request: ${req.method} ${req.originalUrl}`);
    const fullPath = req.originalUrl;
    const isPublicRoute = publicRoutes.some(route => {
        const routeRegExp = new RegExp(`^${route.replace('*', '.*')}$`);
        return routeRegExp.test(fullPath);
    });

    if (isPublicRoute) {
        logger.info(`Public route: ${fullPath}`);
        next();
    } else {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return HttpResponseBuilder.buildUnAuthorized(
                res,
                'Forbidden: Missing authorization header',
            );
        } else {
            try {
                const userCredentials = userIdentityService.verifyUser(token);
                userIdentityService.assignUserToRequestContext(
                    userCredentials,
                    req,
                );
                next();
            } catch (error) {
                logger.error(
                    `Error during user verification: ${error.message}`,
                );
                res.status(500).send('Internal Server Error');
            }
        }
    }
};
