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
const port = process.env.PORT ||  8000
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
app.get('/',(req, res)=>{
    res.send("api is working");
})

mongoose.set("strictQuery", false);
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB database connected");
    } catch (err) {
        console.log("MongoDB database connection failed", err);
    }
};


//middleware
app.use(express.json({ limit: "3mb" }));
app.use(cors(corsOption))
app.use(cookieParser())

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

app.listen(port,()=>{
    connect();
    console.log(`server listening on port: ${port}`);
})
