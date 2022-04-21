const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

// Middleware
app.use(cors());
app.use(express.json());

// user: dbuser1
// password: QlWcTzqrRIrhBTEW


const uri = "mongodb+srv://dbuser1:QlWcTzqrRIrhBTEW@cluster0.wnin1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const userCollection = client.db("foodExpress").collection("user");

        // get user
        app.get('/user', async(req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);

            })

            app.get('/user/:id', async(req, res) => {
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const result = await userCollection.findOne(query);
                res.send(result);
            })

        // POST User: add a new user
        app.post('/user', async(req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        //update user
        app.put('/user/:id', async(req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)};
            const option = {upsert: true};
            const updatedDoc = {$set: updatedUser};
            const result = await userCollection.updateOne(filter, updatedDoc, option);
            res.send(result);

        })

        // delete a user
        app.delete('/user/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
        
    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});