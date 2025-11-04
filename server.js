const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";
const client = new MongoClient(MONGO_URL);

// GET all wedding guests
app.get("/getGuests", async (req, res) => {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB server');

        const db = client.db("wedding-db");
        const data = await db.collection('guests').find({}).toArray();
        
        res.json({
            success: true,
            count: data.length,
            guests: data
        });
    } catch (error) {
        console.error('Error fetching guests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching guest list'
        });
    } finally {
        await client.close();
    }
});

// POST new wedding guest RSVP
app.post("/addGuest", async (req, res) => {
    const guestObj = {
        ...req.body,
        rsvpDate: new Date(),
        timestamp: Date.now()
    };
    
    console.log('New RSVP received:', req.body);
    
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB server');

        const db = client.db("wedding-db");
        const result = await db.collection('guests').insertOne(guestObj);
        
        console.log('Guest RSVP saved to database');
        console.log('Inserted ID:', result.insertedId);
        
        res.status(200).json({
            success: true,
            message: 'RSVP received successfully!',
            guestId: result.insertedId
        });
    } catch (error) {
        console.error('Error saving RSVP:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving RSVP'
        });
    } finally {
        await client.close();
    }
});

// GET RSVP count
app.get("/getRSVPCount", async (req, res) => {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB server');

        const db = client.db("wedding-db");
        const count = await db.collection('guests').countDocuments();
        
        res.json({
            success: true,
            totalRSVPs: count
        });
    } catch (error) {
        console.error('Error getting RSVP count:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting RSVP count'
        });
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log(`🎉 Wedding RSVP server running on port ${PORT}`);
    console.log(`📧 Visit http://localhost:${PORT} to view the wedding invitation`);
});