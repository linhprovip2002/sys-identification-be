import { BEARER_AUTH_CONFIG } from '../constants';

interface SwaggerOptions {
    openapi: string;
    info: any;
    servers: any;
    auth: boolean;
    basePath: string;
}

interface RouteOptions {
    route?: any;
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
    tags?: string | string[];
    description?: any;
    security?: any;
    model?: string;
    body?: any;
    params?: any;
    consumes?: any;
    errors?: any[];
    example?: any;
}

interface ModelOptions {
    name: string;
    properties: any;
    isArray?: boolean;
}

export class SwaggerBuilder {
    #instance: any = {};
    #resolvers: (() => void)[] = [];

    constructor(options: SwaggerOptions) {
        const { openapi, info, servers, auth, basePath } = options;

        this.#instance.openapi = openapi;
        this.#instance.info = info;
        this.#instance.servers = servers;
        this.#instance.basePath = basePath;
        this.#instance.example = {};
        this.#instance.components = {
            schemas: {},
        };
        this.#instance.tags = [];
        this.#instance.paths = {};

        if (auth) {
            this.#instance.components['securitySchemes'] = {
                bearerAuth: BEARER_AUTH_CONFIG,
            };
        }
    }

    #toResponseSuccess = (model: string | undefined) => ({
        200: {
            description: 'successful operation',
            content: model
                ? {
                      'application/json': {
                          schema: {
                              type: 'array',
                              items: {
                                  $ref: `#/components/schemas/${model}`,
                              },
                          },
                      },
                  }
                : '',
        },
    });

    #toErrors = (errors?: { status: number; description: string }[]) => {
        const responses: any = {};

        errors?.forEach(error => {
            if (!error.status || !error.description) {
                throw new Error(
                    'Error in swagger must contain status and description',
                );
            }
            responses[error.status] = {
                description: error.description,
            };
        });
        return responses;
    };

    addTag(name: string) {
        this.#resolvers.push(() => {
            if (!this.#instance.tags.some((tag: string) => tag === name)) {
                this.#instance.tags.push(name);
            }
        });
    }

    addRoute(options: RouteOptions) {
        this.#resolvers.push(() => {
            const {
                route,
                method,
                tags,
                description,
                security,
                model,
                body,
                params = [],
                consumes = [],
                errors = [],
            } = options;
            const responses: any = {};

            if (!this.#instance.paths[route]) {
                this.#instance.paths[route] = {};
            }

            this.#instance.paths[route][method] = {
                tags: Array.isArray(tags) ? tags : [tags],
                description,
                security: security
                    ? [
                          {
                              bearerAuth: [],
                          },
                      ]
                    : [],
                produces: ['application/json'],
                consumes,
                parameters: params,
                requestBody: body
                    ? {
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: `#/components/schemas/${body}`,
                                  },
                              },
                          },
                          required: true,
                      }
                    : {},
                responses: {
                    ...responses,
                    ...this.#toResponseSuccess(model),
                    ...this.#toErrors(errors),
                },
            };
        });
    }

    addModel({ name, properties, isArray }: ModelOptions) {
        if (isArray) {
            this.#resolvers.push(() => {
                this.#instance.components.schemas[name] = {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties,
                    },
                };
            });
        }

        this.#resolvers.push(() => {
            this.#instance.components.schemas[name] = {
                type: 'object',
                properties,
            };
        });
    }

    build() {
        this.#resolvers.map(resolver => resolver());
        return this.#instance;
    }
}
