import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import indexRoutes from './routes';
// import swaggerUi from 'swagger-ui-express';
// import swaggerSpec from './configs/swagger';
import cors from 'cors';

const app = express().disable('x-powered-by');

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:9001',
  'http://localhost:9002',
  'https://apipaymentservice.skyparking.online',
  'https://membership.skyparking.online',
  'https://apiintegration.skyparking.online'
];

// CORS configuration
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, success?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests from allowed origins or non-browser requests
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Enable cookies and authentication headers
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Swagger if enabled
// const enableSwagger = process.env.ENABLE_SWAGGER === 'true';

// if (enableSwagger) {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// }

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User routes
app.use('/v1', indexRoutes);

export default app;
