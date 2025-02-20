const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ub1fi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server
        await client.connect();

        const TaskCollection = client.db('taskManagementDB').collection('Tasks');

        // add new task on the database
        app.post('/tasks', async (req, res) => {
            const newTask = req.body;
            const result = await TaskCollection.insertOne(newTask);
            res.send(result);
        });

        // get all the task on the database
        app.get('/tasks', async (req, res) => {
            const result = await TaskCollection.find().toArray();
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("TaskManagementApplication server is running");
});

app.listen(port, () => {
    console.log(`TaskManagementApplication server is running on port: ${port}`);
});