import express, { Application } from "express" ;
import hikeRoutes from './routes/hikes';
import { logRequest } from "./middleware/logger.middleware";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app: Application = express();

app.use(express.json());

app.use(logRequest);

app.use('/api/v1/hikes', hikeRoutes);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

export { app };


    
