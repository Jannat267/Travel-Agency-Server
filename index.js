const express =require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app =express();
const port= process.env.PORT || 5000;

//middlewar
app.use(cors());
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v2cxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/',(req,res)=>{
    res.send('running my CRUD server');
});
app.listen(port,()=>{
    console.log('running server on port',port);
});
async function run() {
    try {
      await client.connect();
      // database
      const database = client.db("travel-agency");
      //flight collection
      const flightsCollection = database.collection("flights");
      // ordercollection
      const ordersCollection = database.collection("orders");
      // get a document for flight
      app.get('/flights', async(req,res)=>{
        const cursor=flightsCollection.find({});
       const flights=await cursor.toArray();
       res.send(flights);
  
      })
      //  get a document for order
      app.get('/orders', async(req,res)=>{
        const cursor=ordersCollection.find({});
       const orders=await cursor.toArray();
       res.send(orders);
  
      })
      //  get a document for single order
      app.get('/orders/:email', async(req,res)=>{
        console.log("dfghghbgf");
        const email= req.params.email;
        console.log(email);
        const cursor=ordersCollection.find({"email": email});
       const myOrders=await cursor.toArray();
       res.send(myOrders);
  
      })
      //  get a document for single flight
      app.get('/flights/:id',async(req,res)=>{
        const id = req.params.id;
        console.log("ddd",id);
        const query={_id:ObjectId(id)};
        const result = await flightsCollection.findOne(query); 
        console.log(result);
        res.json(result)

    })
    // post flights in db
      app.post('/flights', async(req,res)=>{
        const flights=req.body;
        console.log('hit the post api',flights);
        const result = await flightsCollection.insertOne(flights) 
        
        res.json(result)
       
      })
      // post orders
      app.post('/orders', async(req,res)=>{
        const orders=req.body;
        console.log('hit the post api',orders);
        const result = await ordersCollection.insertOne(orders) 
        res.json(result)
       
      })
      // delete single order
      app.delete('/orders/:id',async(req,res)=>{
          const id = req.params.id;
          const query={_id:ObjectId(id)};
          const result = await ordersCollection.deleteOne(query); 
          
          res.json(result)

      })
      // update order
      app.put('/orders/:id',async(req,res)=>{
          const id = req.params.id;
          const filter={_id:ObjectId(id)};
          const updateDoc={
              $set:{
                status:"Active",
              }
          };
          const result = await ordersCollection.updateOne(filter,updateDoc);
          res.json(result)

      })
  
     }
     
    finally {
      //await client.close();
    }
  }
  run().catch(console.dir)