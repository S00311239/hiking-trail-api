import express, {Application, Request, Response} from "express" ;
import carRoutes from './routes/cars';
import { authenticateKey } from './middleware/auth.middleware';
import { logRequest } from "./middleware/logger.middleware";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app: Application = express();

app.use(express.json());

app.use(logRequest);

// Routes
app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "hello from Una"
    });
});

app.get('/bananas', async (_req : Request, res: Response) => {
    res.json({
    message: "this is bananas",
    });
});

app.use('/api/v1/cars', authenticateKey, carRoutes);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

export { app };


    
