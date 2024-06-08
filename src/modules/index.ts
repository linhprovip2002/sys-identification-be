import { createModuleFactory } from '../system/factories/index';
import { createAuthModule } from './auth';
import { createUserModule } from './user';
import { createCategoryModule } from './category';
import { createProductModule } from './product';
import { createBlogModule } from './blog';
import { createVariantModule } from './variant';
import { createBreedModule } from './breed';
import { createOrderModule } from './order';
import { createConversationModule } from './convo/conversation.controller';
import { createFeedBackModule } from './feedback';
export const createRootModule = createModuleFactory({
    path: '/api',
    name: 'Root',
    bundler: router => {
        createAuthModule(router);
        createUserModule(router);
        createCategoryModule(router);
        createProductModule(router);
        createVariantModule(router);
        createBlogModule(router);
        createBreedModule(router);
        createOrderModule(router);
        createConversationModule(router);
        createFeedBackModule(router);
    },
});
