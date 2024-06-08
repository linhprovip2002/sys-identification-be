// @ts-check
export class PropertyFactory {
    static #DEFAULT_GENERATOR = 'string';

    static #PRIMITIVE_TYPES = ['string', 'int', 'dateTime', 'bool'];

    static TYPE_MAP_TO_MODELS = {
        string: {
            type: 'string',
        },
        int: {
            type: 'integer',
            format: 'int64',
        },
        dateTime: {
            type: 'string',
            format: 'date-time',
        },
        bool: {
            type: 'boolean',
            default: true,
        },
        file: {
            type: 'file',
        },
        object: {
            type: 'object',
        },
        Number: {
            type: 'number',
        },
        array: (item, params = {}) => {
            if (PropertyFactory.#PRIMITIVE_TYPES.includes(item)) {
                return {
                    type: 'array',
                    items: {
                        ...PropertyFactory.TYPE_MAP_TO_MODELS[item],
                        ...params,
                    },
                };
            }
            return {
                type: 'array',
                items: {
                    $ref: `#/components/schemas/${item}`,
                },
            };
        },
        enum: (enumModel, params = {}) => ({
            type: 'string',
            enum: Object.values(enumModel),
            ...params,
        }),
        model: (dtoModel, params = {}) => ({
            $ref: `#/components/schemas/${dtoModel}`,
            ...params,
        }),
    };

    static #createSwaggerType({ type, model,enumValues, example }) {
        if (enumValues) { // If enum values exist, return enum type
            return PropertyFactory.TYPE_MAP_TO_MODELS['enum'](enumValues, { example });
        }
    
        return ['enum', 'model', 'array'].includes(type)
            ? PropertyFactory.TYPE_MAP_TO_MODELS[type](model, { example })
            : PropertyFactory.TYPE_MAP_TO_MODELS[type];
    }

    /**
     *
     * @param {{type: string, model?: string, required?: boolean, readOnly?: boolean, example?: string}} options
     * @returns
     */
    static createProperty(options) {
        const {
            type,
            model = PropertyFactory.#DEFAULT_GENERATOR,
            enum: enumValues,
            required = true,
            readOnly = false,
            example,
        } = options;

        const swaggerType = PropertyFactory.#createSwaggerType({
            type,
            model,
            enumValues,
            example,
        });

        return {
            required,
            example,
            readOnly,
            ...swaggerType,
        };
    }

    /**
     *
     * @param {{type?: DocumentType, model?: string, required?: boolean, readOnly?: boolean, example?: string, name?: string, paramsIn?: string, description?: string}} options
     * @returns
     */
    static createParam(options) {
        const {
            type,
            name,
            model,
            enum: enumValues,
            paramsIn = 'query',
            required = true,
            example,
            description,
        } = options;

        const swaggerType = PropertyFactory.#createSwaggerType({
            type,
            model,
            enumValues,
            example,
        });

        return {
            name,
            in: paramsIn,
            schema: swaggerType,
            required,
            example,
            description,
        };
    }
}
