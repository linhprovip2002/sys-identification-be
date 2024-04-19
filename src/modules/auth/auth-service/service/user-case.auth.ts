import { omit } from 'lodash';
import {
    IncorrectLoginException,
    EmailUserExistedException,
    EmailUserNotFoundException,
    TokenUserNotFoundException,
    TokenUserExpired
} from '../exceptions';
import { hashService, userIdentityService } from '.';
import { UserModel } from '../../../../system/model/index';
import { mailService } from '../../../../system/service/mail.service';
import { logger } from '../../../../system';

class AuthenticationService {
    private readonly userIdentityService = userIdentityService;
    private readonly hashService = hashService;
    private readonly mailService = mailService;
    constructor() {
        this.userIdentityService = userIdentityService;
        this.hashService = hashService;
        this.mailService = mailService;
    }

    async login(loginDto) {
        const { email, password } = loginDto;

        const user = await UserModel.findOne({ email }).lean();

        if (
            !user ||
            !(await this.hashService.compare({
                raw: password,
                hashed: user.password,
            }))
        ) {
            throw new IncorrectLoginException();
        }

        return this.userIdentityService.sign(user);
    }

    async register({ firstName, lastName, email, password }) {
        const user = await UserModel.findOne({ email }).lean();

        if (user) {
            throw new EmailUserExistedException();
        }

        const hashedPassword = await this.hashService.hash(password);
        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 1);
        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            refreshToken: hashedPassword,
            expired: expirationTime,
            isActive: true,
        });

        return this.userIdentityService.sign(newUser);
    }

    async getMe(userId) {
        const user = await UserModel.findById(userId).lean();

        return omit(user, 'password');
    }

    async forgotPassword(email) {
        const user = await UserModel.findOne({ email: email }).lean();
        if (!user) {
            throw new EmailUserNotFoundException();
        }

        // export html template to mail reset password
        // Path: src/modules/auth/auth-service/service/html.mail.ts
        logger.info('Send mail reset password' + JSON.stringify(user));
        const htmlTemplate = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            background-image: url('https://img.freepik.com/premium-vector/forgot-password-concept-isolated-white_263070-194.jpg');
                            background-size: cover;
                            background-position: center;
                        }
                        h1 {
                            color: #333;
                            text-align: center;
                            font-size: 28px;
                        }
                        p {
                            color: #666;
                            text-align: center;
                            font-size: 18px;
                        }
                        a {
                            display: inline-block;
                            color: #007BFF;
                            text-decoration: none;
                            font-size: 18px;
                            padding: 10px 20px;
                            border-radius: 5px;
                            margin-top: 20px;
                            transition: background-color 0.3s ease;
                        }
                        a:hover {
                            background-color: rgba(0, 123, 255, 0.1);
                            text-decoration: none;
                        }
                        @keyframes rotate {
                            0% {
                                transform: rotate(0deg);
                            }
                            100% {
                                transform: rotate(360deg);
                            }
                        }
                        .rotate {
                            animation: rotate 2s linear infinite;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Forgot Password?</h1>
                        <p>Token to reset password</p>
                        <a href="" class="rotate">${user.refreshToken}</a>
                    </div>
                </body>
                </html>
                `;
            mailService.sendMail(
                email,
                'Forget password',
                'Reset password',
                htmlTemplate,
            );
        return;
    }
    async resetPassword(body) {
        try {
            const user = await UserModel.findOne({ refreshToken: body.refreshToken }).lean();
            if (!user) {
                throw new TokenUserNotFoundException();
            }
            
            // Check if token has expired
            if (new Date(user.expired) < new Date()) {
                throw new TokenUserExpired();
            }
    
            const hashedPassword = await this.hashService.hash(body.newPassword);
            const expirationTime = new Date();
            expirationTime.setDate(expirationTime.getDate() + 1);
            
            // Create refresh token 
            const refreshToken = `${user.email}.${new Date().getTime()}`;
            
            // Update user's password and expiration time
            const updatedUser = await UserModel.findOneAndUpdate(
                { refreshToken: body.refreshToken },
                { $set: { password: hashedPassword, expired: expirationTime } },
                { new: true } // Return the updated document
            ).lean();
    
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }
    
    
}

export const authenticationService = new AuthenticationService();
