import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import { identityGuard } from '../auth/auth-service/service';
import { logger } from '../../system/logging/logger';
import { createOrderService } from './order-service/order.service';
import { OrderStatus } from '../../system/model';
import {
    orderUpdateValidator,
    orderCreateValidator,
} from './order-service/order.validator';
const MODULE_NAME = 'Order';
export const createOrderModule = createModuleFactory({
    path: '/orders',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);
        //create order
        const CREATE_ORDER_DTO = 'CreateOrderDto';
        swaggerBuilder.addModel({
            name: 'OrderItem',
            properties: {
                productId: PropertyFactory.createProperty({
                    description: 'Product id',
                }),
                quantity: PropertyFactory.createProperty({
                    description: 'Product quantity',
                }),
                variantOptions: PropertyFactory.createProperty({
                    description: 'Product variant options',
                }),
                price: PropertyFactory.createProperty({
                    description: 'Product price',
                }),
            },
        });
        swaggerBuilder.addModel({
            name: CREATE_ORDER_DTO,
            properties: {
                userId: PropertyFactory.createProperty({
                    description: 'User id',
                }),
                items: PropertyFactory.createProperty({
                    description: 'Order items',
                    type: 'array',
                    model: 'OrderItem',
                }),
                total: PropertyFactory.createProperty({
                    description: 'Total price',
                }),
                nameUser: PropertyFactory.createProperty({
                    description: 'User name',
                }),
                phone: PropertyFactory.createProperty({
                    description: 'Phone number',
                }),
                status: PropertyFactory.createProperty({
                    description: 'Order status',
                    enum: OrderStatus,
                }),
                address: PropertyFactory.createProperty({
                    description: 'Address string',
                }),
            },
        });
        swaggerBuilder.addRoute({
            description: 'create order',
            route: '/orders',
            tags: [MODULE_NAME],
            method: 'post',
            body: CREATE_ORDER_DTO,
            // security: true,
        });

        router.post(
            '/',
            orderCreateValidator,
            // identityGuard,
            createHandler(async (req, res) => {
                const order = await createOrderService.createOrder(req.body);
                return HttpResponseBuilder.buildOK(res, order);
            }),
        );
        // get orders
        swaggerBuilder.addRoute({
            description: 'get orders',
            route: '/orders',
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
                PropertyFactory.createParam({
                    name: 'nameUser',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'User name',
                    required: false,
                }),
            ],
        });
        router.get(
            '/',
            createHandler(async (req, res) => {
                const orders = await createOrderService.getOrders(req.query);
                return HttpResponseBuilder.buildOK(res, orders);
            }),
        );
        // get order by id
        swaggerBuilder.addRoute({
            description: 'get order by id',
            route: '/orders/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Order id',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const order = await createOrderService.getById(req.params.id);
                if (order !== null) {
                    order.items.map(item => {
                        delete item.productId.htmlDomDescription;
                        delete item.productId.variantOptions;
                        item.variantOptions = item.variantOptions[0];
                    });
                }

                return HttpResponseBuilder.buildOK(res, order);
            }),
        );
        // update order
        swaggerBuilder.addModel({
            name: 'UpdateOrderDto',
            properties: {
                status: PropertyFactory.createProperty({
                    description: 'Order status',
                }),
            },
        });
        swaggerBuilder.addRoute({
            description: 'update order',
            route: '/orders/{id}',
            tags: [MODULE_NAME],
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Order id',
                    required: true,
                }),
            ],
            body: 'UpdateOrderDto',
            security: true,
        });
        router.patch(
            '/:id',
            identityGuard,
            createHandler(async (req, res) => {
                const order = await createOrderService.updateOrder(
                    req.params.id,
                    req.body,
                );
                return HttpResponseBuilder.buildOK(res, order);
            }),
        );
        // delete order
        swaggerBuilder.addRoute({
            description: 'delete order',
            route: '/orders/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Order id',
                    required: true,
                }),
            ],
            security: true,
        });
        router.delete(
            '/:id',
            identityGuard,
            createHandler(async (req, res) => {
                await createOrderService.deleteOrder(req.params.id);
                return HttpResponseBuilder.buildNoContent(res);
            }),
        );
        // create enum model for order status
        swaggerBuilder.addModel({
            name: 'OrderStatus',
            properties: {
                status: PropertyFactory.createProperty({
                    description: 'Order status',
                    enum: OrderStatus,
                }),
            },
        });

        swaggerBuilder.addRoute({
            description: 'get order by id',
            route: '/orders/{id}/confirm',
            tags: [MODULE_NAME],
            method: 'post',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Order id',
                    required: true,
                }),
            ],
            body: 'OrderStatus',
            security: true,
        });
        router.post(
            '/:id/confirm',
            identityGuard,
            createHandler(async (req, res) => {
                logger.info(
                    'confirm order ' +
                        JSON.stringify(req.params) +
                        ' ' +
                        JSON.stringify(req.body),
                );
                const result = await createOrderService.confirmOrder(
                    req.params.id,
                    req.body.status,
                );
                return HttpResponseBuilder.buildOK(res, result);
            }),
        );
    },
});
