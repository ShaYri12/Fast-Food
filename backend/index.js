import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from 'cors'
import cookieParser from "cookie-parser"
import menuRoute from './routes/menus.js'
import userRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import reviewRoute from './routes/reviews.js'
import orderRoute from './routes/orders.js'
import cartRoute from './routes/cart.js'

dotenv.config();
const app = express();

// Database connection
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        // Configure mongoose settings
        mongoose.set('strictQuery', false);
        mongoose.set('bufferCommands', false);
        
        const db = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB connected successfully');
        
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

// CORS configuration
const corsOption = {
    origin: true, // Allow all origins for now to debug
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

//middleware
app.use(express.json({ limit: "3mb" }));
app.use(cors(corsOption));
app.use(cookieParser());

// Connect to database before handling requests
app.use(async (req, res, next) => {
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

//testing route
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: "API is working",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const Menu = (await import('./models/Menu.js')).default;
        const count = await Menu.countDocuments();
        res.json({
            success: true,
            message: 'Database connection successful',
            menuCount: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Test admin authentication
app.get('/test-admin', async (req, res, next) => {
    try {
        const { verifyAdmin } = await import('./utils/verifyToken.js');
        verifyAdmin(req, res, () => {
            res.json({
                success: true,
                message: 'Admin authentication successful',
                user: req.user
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Test failed',
            error: error.message
        });
    }
});



//Routes
app.use('/api/auth', authRoute);
app.use('/api/menus', menuRoute);
app.use('/api/users', userRoute);
app.use('/api/review', reviewRoute);
app.use('/api/order', orderRoute);
app.use('/api/cart', cartRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
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

const port = process.env.PORT || 8000;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server listening on port: ${port}`);
    });
}

// Export for Vercel
export default app;