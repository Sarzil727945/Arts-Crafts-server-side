const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2a9l2qr.mongodb.net/?retryWrites=true&w=majority`;

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
          // Connect the client to the server	(optional starting in v4.7)
          // await client.connect();

          // server link start
          const serverCollection = client.db('dbAssignment11').collection('cltAssignment11');
          // server link end 

          // server data post start 
          app.post('/Toy', async (req, res) => {
               const newAdd = req.body;
               const result = await serverCollection.insertOne(newAdd)
               res.send(result);
          });
          // server data post exit

          // server data get update start 
          app.get('/Toy/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: new ObjectId(id) }
               const result = await serverCollection.findOne(query);
               res.send(result);
          })
          // server data get update end 

          // server data get start
          app.get('/Toy', async (req, res) => {
               let query = {};
               if (req.query?.email) {
                    query = { email: req.query.email }
               }
               const result = await serverCollection.find(query).toArray();
               res.send(result);
          })
          // server data get exit

          // server data update start
          app.put('/Toy/:id', async (req, res) => {
               const id = req.params.id;
               const filter = { _id: new ObjectId(id) }
               const options = { upsert: true };
               const updateToy = req.body;
               const addToy = {
                    $set: {
                         name: updateToy.name,
                         photoURL: updateToy.photoURL,
                         category: updateToy.category,
                         price: updateToy.price,
                         rating: updateToy.rating,
                         quantity: updateToy.quantity,
                         description: updateToy.description
                    }
               }
               const result = await serverCollection.updateOne(filter, addToy, options);
               res.send(result)
          })
          // server data update end 

          // server data delete start
          app.delete('/Toy/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: new ObjectId(id) }
               const result = await serverCollection.deleteOne(query);
               res.send(result);
          })
          // server data delete exit

          // server all data get start 
          app.get('/Toy', async (req, res) => {
               const cursor = serverCollection.find();
               const result = await cursor.toArray();
               res.send(result);
          })
          // server all data get end 


          // app.get('/server/:id', async (req, res) => {
          //      const id = req.params.id;
          //      const query = { _id: new ObjectId(id) }
          //      const result = await serverCollection.findOne(query)
          //      res.send(result)
          // })



          // Send a ping to confirm a successful connection
          await client.db("admin").command({ ping: 1 });
          console.log("Pinged your deployment. You successfully connected to MongoDB!");
     } finally {
          // Ensures that the client will close when you finish/error
          //     await client.close();
     }
}
run().catch(console.dir);


app.get('/', (req, res) => {
     res.send('assignment11 server running')
})

app.listen(port, () => {
     console.log(`server is running on port: ${port}`);
})