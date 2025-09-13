// const express = require("express");
// const app = express();
// const path = require("path");
// const MongoClient = require("mongodb").MongoClient;

// const PORT = 5050;
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";
// const client = new MongoClient(MONGO_URL);

// //GET all users
// app.get("/getUsers", async (req, res) => {
//     await client.connect(URL);
//     console.log('Connected successfully to server');

//     const db = client.db("apnacollege-db");
//     const data = await db.collection('users').find({}).toArray();
    
//     client.close();
//     res.send(data);
// });

// //POST new user
// app.post("/addUser", async (req, res) => {
//     const userObj = req.body;
//     console.log(req.body);
//     await client.connect(URL);
//     console.log('Connected successfully to server');

//     const db = client.db("apnacollege-db");
//     const data = await db.collection('users').insertOne(userObj);
//     console.log(data);
//     console.log("data inserted in DB");
//     client.close();
// });


// app.listen(PORT, () => {
//     console.log(`server running on port ${PORT}`);
// });


//new ai 
// ...existing code...
const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// serve static files from the public folder relative to this file
app.use(express.static(path.join(__dirname, 'public')));

// fallback: ensure GET / serves the index page even if static middleware is missed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Test route for POST requests
app.post('/test-post', (req, res) => {
    console.log('Test POST route hit');
    console.log('Request body:', req.body);
    res.status(200).send({ success: true, message: 'POST test successful' });
});

const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";
const client = new MongoClient(MONGO_URL);

// connect once at startup
(async () => {
    try {
        await client.connect(); // use the client created with MONGO_URL
        console.log("Connected successfully to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
})();

//GET all users
app.get("/getUsers", async (req, res) => {
    try {
        const db = client.db("apnacollege-db");
        const data = await db.collection("users").find({}).toArray();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }
});

//POST new user
// Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});

app.post("/addUser", async (req, res) => {
    try {
        console.log("POST /addUser received");
        const userObj = req.body;
        console.log("Add user:", userObj);
        if (!userObj.email || !userObj.username || !userObj.password) {
            return res.status(400).send("missing fields");
        }
        const db = client.db("apnacollege-db");
        const result = await db.collection("users").insertOne(userObj);
        console.log("data inserted in DB:", result.insertedId);
        res.status(201).send("created");
    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
// ...existing code...