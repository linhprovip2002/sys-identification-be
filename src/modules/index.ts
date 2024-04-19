import { createModuleFactory } from '../system/factories/index';
import { createAuthModule } from './auth';
import { createUserModule } from './user';
import { createCategoryModule } from './category';
import { createProductModule } from './product';
import { createBlogModule } from './blog';
import { createVariantModule } from './variant';
import { createBreedModule } from './breed';
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
    },
});
