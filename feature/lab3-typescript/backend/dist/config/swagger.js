import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Events API',
            version: '1.0.0',
            description: 'API для управления мероприятиями',
        },
    },
    apis: ['./routes/*.ts'],
};
const specs = swaggerJsdoc(options);
export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
