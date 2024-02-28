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
const allowedOrigins = [
    "https://fast-food-gamma.vercel.app/",
    "https://fast-food-ljab.vercel.app/",
    "http://localhost:5173",
  ];
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );

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
app.use(express.json())
app.use(cookieParser())

//Routes
app.use('/api/auth', authRoute)
app.use('/api/menus', menuRoute)
app.use('/api/users', userRoute)
app.use('/api/review', reviewRoute)
app.use('/api/order', orderRoute)
app.use('/api/cart', cartRoute)


app.listen(port,()=>{
    connect();
    console.log(`server listening on port: ${port}`);
})
