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

app.get('/p/blogs',async (req,res)=>{ //listen to a get request
  const data = await pool.query('SELECT * from blogs')
  res.send(data.rows);
})

app.post('/p/blog',async (req,res)=>{ //listen to a post request  
  console.log(req.body);
  const data = await pool.query(
    'INSERT INTO blogs(title, text, picture_url) VALUES($1, $2, $3) RETURNING *', 
    [req.body.title, req.body.text, req.body.picture]
  );
  res.send(data.rows);
})

// -------------------------- Routes for Mongo -----------------------------------------------

app.get('/m/blogs', async (req, res)=>{
  const collection = await client.db("Blog").collection("blogs");
  const result = await collection.find().toArray();
  res.send(result);
})

app.post('/m/blog',async (req,res)=>{ //listen to a post request
  const collection = await client.db("Blog").collection("blogs");
  const result = await collection.insertOne(req.body)
  res.send(result);
  
})


app.listen(PORT, ()=>{ //listen to the port we chose above
    //print to the console that the server is listening
    console.log("listening to port: " + PORT);
})