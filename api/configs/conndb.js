const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://api_recruit:As4TapTe768DOS68@recruitment.mos8yva.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to the database');
        return client.db('developer_exam');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw error;
    }
}

module.exports = { connectDB };
