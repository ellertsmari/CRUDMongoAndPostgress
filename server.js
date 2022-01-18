//requiering express and initializing the app:
const express = require('express')

//requiering the cors middleware:
const cors = require('cors');
require('dotenv').config();

//These lines are only needed for the PostgreSQL part
const { Pool } = require('pg') 
const pool = new Pool() 

//These lines are only needed for the MongoDB part
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://Vefskolinn:${process.env.MONGOPASS}@cluster0.ftydf.mongodb.net/Blog?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

//This is for both:
const app = express();
const PORT = 5001; //we will use port 5001


app.use(cors());//telling express to use the cors middleware
app.use(express.json())//telling express to accept json in body of POST requests

app.get('/',async (req,res)=>{ //listen to a get request
  
  res.send("Welcome to our API");
})

// ----------------------------- Routes for Postgres ----------------------------------------

//CREATE
app.post('/p/blog',async (req,res)=>{ //listen to a post request  
  console.log(req.body);
  const data = await pool.query(
    'INSERT INTO blogs(title, text, picture_url) VALUES($1, $2, $3) RETURNING *', 
    [req.body.title, req.body.text, req.body.picture]
  );
  res.send(data.rows);
})

//READ
app.get('/p/blogs',async (req,res)=>{ //listen to a get request
  const data = await pool.query('SELECT * from blogs')
  res.send(data.rows);
})

//UPDATE
app.put("/p/blog", (req, res)=>{ //listen to a put request
  pool.query(
    "UPDATE blogs2 SET title=$1, text=$2, picture_url=$3 where title=$4",
    [req.body.title, req.body.text, req.body.picture, req.body.oldTitle]
  ).then((result)=>{
    res.send(result);
  }).catch(e=>{
    res.send(e);
  })
})


//DELETE
app.delete("/p/blog", (req, res)=>{
  pool.query(
    "DELETE FROM blogs2 WHERE title=$1",
    [req.body.title]
  ).then((result)=>{
    res.send(result);
  }).catch(e=>{
    res.send(e);
  })
})

// -------------------------- Routes for Mongo -----------------------------------------------


//CREATE
app.post('/m/blog',async (req,res)=>{ //listen to a post request
  const collection = await client.db("Blog").collection("blogs");
  const result = await collection.insertOne(req.body)
  res.send(result);
  
})

//READ
app.get('/m/blogs', async (req, res)=>{
  const collection = await client.db("Blog").collection("blogs");
  const result = await collection.find().toArray();
  res.send(result);
})

//UPDATE
app.put("/m/blog", async (req, res)=>{
  const collection = await client.db("Blog").collection('blogs');
  const result = await collection.updateOne(
    { title: req.body.oldTitle }, // Not best practice, see comment below 
    { $set: req.body }
  );
  res.send(result);
  /* 
  Here it would be much better to use _id than title because if we have two 
  articles with the same title we would always only be able to change the first one
  */
})

//DELETE
app.delete("/m/blog", async (req, res)=>{
  const collection = await client.db("Blog").collection('blogs');
  const result = await collection.deleteOne({title:req.body.title});
  res.send(result);
})


app.listen(PORT, ()=>{ //listen to the port we chose above
    //print to the console that the server is listening
    console.log("listening to port: " + PORT);
})