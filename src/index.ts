import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { createRootModule } from './modules';
import { errorHandler } from './system/exceptions/error-handler/error-handler';
import { connectDatabase } from './system/database/database.connector';
import { notFoundHandler } from './system/exceptions/error-handler/';
import { swaggerBuilder } from './system/swagger';
import { logger } from './system/logging/logger';
// import { authenticationRouter } from './system/middleware/';

const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.json({
        Swagger: 'http://localhost:3000/docs',
    });
});

(async () => {
    app.use(
        cors({
            origin: '*',
            optionsSuccessStatus: 200,
        }),
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    // app.use(authenticationRouter);
    createRootModule(app);
    app.use(swaggerUi.serveWithOptions({ redirect: false }));
    app.use(swaggerUi.serve, swaggerUi.setup(swaggerBuilder.build()));
    app.use(notFoundHandler);
    app.use(errorHandler);
    await connectDatabase();
})();

app.listen(port, () => {
    logger.info(`Example app listening at http://localhost:${port}`);
    logger.info(`Swagger at http://localhost:${port}/docs`);
});
