import { connectDB } from './utils/database.js';
import Menu from './models/Menu.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        await connectDB();
        
        console.log('Testing menu count...');
        const count = await Menu.countDocuments();
        console.log('Menu count:', count);
        
        console.log('Testing menu find...');
        const menus = await Menu.find().limit(1);
        console.log('Sample menu:', menus[0] ? menus[0].title : 'No menus found');
        
        console.log('Database test completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Database test failed:', error);
        process.exit(1);
    }
}

testDatabase();