import express, {Request, Response } from 'express';
import bodyParser from 'body-parser';
import indexRoutes from './routes'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './configs/swagger';
import cors from 'cors';


// Kalau sudah Online

// const corsOptions = {
//   origin: 'http://example.com', // Replace with your allowed origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };

// Initialize express app
const app = express().disable('x-powered-by');

app.use(express.json());
app.use(cors());
// Initialize Swagger
const enableSwagger = process.env.ENABLE_SWAGGER === 'true'; 


if (enableSwagger) {
    // Serve Swagger API documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User routes (Example)
app.use('/v1',indexRoutes);

export default app;
