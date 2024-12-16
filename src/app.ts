import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import indexRoutes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './configs/swagger';
import cors from 'cors';

// Initialize express app
const app = express().disable('x-powered-by');

// Allow requests from all origins (CORS configuration)
app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

app.use(express.json());

// Initialize Swagger if enabled
const enableSwagger = process.env.ENABLE_SWAGGER === 'true';

if (enableSwagger) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User routes
app.use('/v1', indexRoutes);

export default app;
