import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import {
    CreateBlogService,
    blogUpdateDtoValidator,
    blogCreateDtoValidator,
} from './blog-service/';
import { logger } from '../../system/logging/logger';

const MODULE_NAME = 'Blog';
export const createBlogModule = createModuleFactory({
    path: '/blogs',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);
        const BLOG_DTO_NAME = 'BlogDto';
        swaggerBuilder.addModel({
            name: BLOG_DTO_NAME,
            properties: {
                title: PropertyFactory.createProperty({ type: 'string' }),
                content: PropertyFactory.createProperty({ type: 'string' }),
                category: PropertyFactory.createProperty({ type: 'string' }),
                shortContent: PropertyFactory.createProperty({
                    type: 'string',
                }),
                thumbnail: PropertyFactory.createProperty({ type: 'string' }),
            },
        });
        swaggerBuilder.addRoute({
            description: 'Create blog',
            route: '/blogs',
            tags: [MODULE_NAME],
            body: BLOG_DTO_NAME,
            method: 'post',
        });
        router.post(
            '/',
            blogCreateDtoValidator,
            createHandler(async (req, res) => {
                const createBlogDTO = {
                    title: req.body.title,
                    content: req.body.content,
                    category: '66138671b74b79685c342a21',
                    shortContent: req.body.shortContent,
                    thumbnail: req.body.thumbnail
                        ? req.body.thumbnail
                        : 'https://via.placeholder.com/150',
                };
                const blog = await CreateBlogService.createBlog(createBlogDTO);
                return HttpResponseBuilder.buildCreated(res, blog);
            }),
        );
        // get all blog
        swaggerBuilder.addRoute({
            description: 'Get all blogs',
            route: '/blogs',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'limit',
                    paramsIn: 'query',
                    type: 'number?',
                    description: 'Number of items per page (limit)',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'page',
                    paramsIn: 'query',
                    type: 'number?',
                    description: 'Page number',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'search',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'Search query',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'sort',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'Sort query',
                    required: false,
                }),
            ],
        });
        router.get(
            '/',
            createHandler(async (req, res) => {
                const blogs = await CreateBlogService.getBlogs(req.query);
                return HttpResponseBuilder.buildOK(res, blogs);
            }),
        );

        //get products by Id
        swaggerBuilder.addRoute({
            description: 'Get blog by Id',
            route: '/blogs/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Blog ID',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const blog = await CreateBlogService.getById(req.params.id);
                return HttpResponseBuilder.buildOK(res, blog);
            }),
        );
        // update blog
        swaggerBuilder.addRoute({
            description: 'Update blog',
            route: '/blogs/{id}',
            tags: [MODULE_NAME],
            body: BLOG_DTO_NAME,
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Blog ID',
                    required: true,
                }),
            ],
        });
        router.patch(
            '/:id',
            blogUpdateDtoValidator,
            createHandler(async (req, res) => {
                const updatedBlog = await CreateBlogService.updateBlog(
                    req.params.id,
                    req.body,
                );
                return HttpResponseBuilder.buildOK(res, updatedBlog);
            }),
        );
        // delete blog
        swaggerBuilder.addRoute({
            description: 'Delete blog',
            route: '/blogs/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Blog ID',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            createHandler(async (req, res) => {
                await CreateBlogService.deleteBlog(req.params.id);
                return HttpResponseBuilder.buildNoContent(res);
            }),
        );
    },
});
