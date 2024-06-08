import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { createRootModule } from './modules';
import { errorHandler } from './system/exceptions/error-handler/error-handler';
import { connectDatabase } from './system/database/database.connector';
import { notFoundHandler } from './system/exceptions/error-handler/';
import { swaggerBuilder } from './system/swagger';
import { logger } from './system/logging/logger';
import { initSocket } from './system/service/socket.service';
import http from 'http';
const app = express();
const port = process.env.PORT || 3000;
const portSocket = 3001;
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
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: false }));
    // app.use(authenticationRouter);
    createRootModule(app);
    app.use(swaggerUi.serveWithOptions({ redirect: false }));
    app.use(swaggerUi.serve, swaggerUi.setup(swaggerBuilder.build()));
    app.use(notFoundHandler);
    app.use(errorHandler);
    await connectDatabase();
})();
const server = http.createServer(app);
// allow cors http
initSocket(server);
server.listen(portSocket, () => {
    logger.info(`Socket.io server listening at http://localhost:${portSocket}`);
});

app.listen(port, () => {
    logger.info(`Example app listening at http://localhost:${port}`);
    logger.info(`Swagger at http://localhost:${port}/docs`);
});
