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

// GET all blocked sites
app.get("/api/blocked-sites", async (req, res) => {
    try {
        await client.connect();
        const db = client.db("social-blocker-db");
        const sites = await db.collection('blocked-sites').find({}).toArray();
        res.json(sites);
    } catch (error) {
        console.error("Error fetching blocked sites:", error);
        res.status(500).json({ error: "Failed to fetch blocked sites" });
    } finally {
        await client.close();
    }
});

// POST new blocked site
app.post("/api/blocked-sites", async (req, res) => {
    try {
        const siteData = req.body;
        await client.connect();
        const db = client.db("social-blocker-db");
        const result = await db.collection('blocked-sites').insertOne(siteData);
        res.json({ success: true, id: result.insertedId });
    } catch (error) {
        console.error("Error adding blocked site:", error);
        res.status(500).json({ error: "Failed to add blocked site" });
    } finally {
        await client.close();
    }
});

// DELETE blocked site
app.delete("/api/blocked-sites/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await client.connect();
        const db = client.db("social-blocker-db");
        const { ObjectId } = require("mongodb");
        await db.collection('blocked-sites').deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting blocked site:", error);
        res.status(500).json({ error: "Failed to delete blocked site" });
    } finally {
        await client.close();
    }
});

// UPDATE blocked site status
app.patch("/api/blocked-sites/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        await client.connect();
        const db = client.db("social-blocker-db");
        const { ObjectId } = require("mongodb");
        await db.collection('blocked-sites').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating blocked site:", error);
        res.status(500).json({ error: "Failed to update blocked site" });
    } finally {
        await client.close();
    }
});

// GET all blocking sessions
app.get("/api/sessions", async (req, res) => {
    try {
        await client.connect();
        const db = client.db("social-blocker-db");
        const sessions = await db.collection('sessions').find({}).sort({ startTime: -1 }).limit(10).toArray();
        res.json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ error: "Failed to fetch sessions" });
    } finally {
        await client.close();
    }
});

// POST new session
app.post("/api/sessions", async (req, res) => {
    try {
        const sessionData = req.body;
        await client.connect();
        const db = client.db("social-blocker-db");
        const result = await db.collection('sessions').insertOne(sessionData);
        res.json({ success: true, id: result.insertedId });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ error: "Failed to create session" });
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Social Media Blocker server running on port ${PORT}`);
});