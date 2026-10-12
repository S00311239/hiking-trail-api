import swaggerJSDoc from 'swagger-jsdoc';


const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Car API',
            version: '1.0.0',
            description: 'REST API for managing cars blah blah blah'
        },
         servers: [
            {
                 url: "/api/v1",
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
            },
        },
    },
    apis: ['./src/controllers/*.ts', './src/models/*.ts']
};

export const swaggerSpec = swaggerJSDoc(options);