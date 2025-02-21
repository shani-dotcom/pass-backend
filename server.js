const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Ensure required environment variables are present
if (!process.env.MONGO_URI || !process.env.DB_NAME) {
    console.error("Missing required environment variables. Check your .env file.");
    process.exit(1);
}

// Connection URL from .env file
const client = new MongoClient(process.env.MONGO_URI);
const dbName = process.env.DB_NAME;
const app = express();
const port = process.env.PORT || 3000; // Allow custom port if specified

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
connectDB();

app.get('/', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/', async (req, res) => {
    try {
        const password = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.insertOne(password);
        res.send({ success: true, result: findResult });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete('/', async (req, res) => {
    try {
        const password = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.deleteOne(password);
        res.send({ success: true, result: findResult });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
