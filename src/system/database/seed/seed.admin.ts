import { connectDatabase } from '../database.connector';
import { logger } from '../../logging/logger';
import { authenticationService } from '../../../modules/auth/auth-service/service';

async function seedAdmin() {
    logger.info('Seeding admin...');
    connectDatabase();

    const registerDto = {
        firstName: 'admin',
        lastName: 'A',
        email: 'admin@gmail.com',
        password: 'admin123',
    };
    const authCredentials = await authenticationService.register(registerDto);
    if (authCredentials) {
        logger.info('Admin seeded successfully');
        return;
    } else {
        logger.error('Failed to seed admin');
        return;
    }
}
seedAdmin();
