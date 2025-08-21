import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
    // If already connected, return
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    // If connecting, wait for it
    if (mongoose.connection.readyState === 1) {
        isConnected = true;
        console.log('Database already connected');
        return;
    }

    try {
        mongoose.set('strictQuery', false);
        
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
        });

        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB connected successfully');
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
            isConnected = true;
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
            isConnected = false;
        });

    } catch (error) {
        console.error('Database connection failed:', error);
        isConnected = false;
        throw error;
    }
};

export const disconnectDB = async () => {
    if (isConnected) {
        await mongoose.disconnect();
        isConnected = false;
        console.log('Database disconnected');
    }
};