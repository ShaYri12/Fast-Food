import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { connectDB } from './utils/database.js'
import menuRoute from './routes/menus.js'
import userRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import reviewRoute from './routes/reviews.js'
import orderRoute from './routes/orders.js'
import cartRoute from './routes/cart.js'

dotenv.config();
const app = express();
const port = process.env.PORT || 8000
const corsOption = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = process.env.NODE_ENV === 'production' 
            ? [
                'https://fast-food-gamma.vercel.app',
                'https://fast-food-server-nine.vercel.app',
                /\.vercel\.app$/,
                /localhost/
              ] 
            : [
                'http://localhost:3000', 
                'http://localhost:5173', 
                'http://127.0.0.1:5173',
                'http://localhost:8000'
              ];
        
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            }
            if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Allow all origins for now to debug
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

//testing
app.get('/', async (req, res) => {
    try {
        await connectDB();
        res.json({ 
            success: true, 
            message: "API is working",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Database connection failed",
            error: error.message 
        });
    }
})

//middleware
app.use(express.json({ limit: "3mb" }));
app.use(cors(corsOption))
app.use(cookieParser())

// Database connection middleware for all API routes
app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

//Routes
app.use('/api/auth', authRoute)
app.use('/api/menus', menuRoute)
app.use('/api/users', userRoute)
app.use('/api/review', reviewRoute)
app.use('/api/order', orderRoute)
app.use('/api/cart', cartRoute)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// For serverless deployment (Vercel), we don't need app.listen
// For local development, we can still use it
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, async () => {
        try {
            await connectDB();
            console.log(`Server listening on port: ${port}`);
        } catch (error) {
            console.error('Failed to start server:', error);
        }
    });
}

// Export the app for serverless deployment
export default app;
