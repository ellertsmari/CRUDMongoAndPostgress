//requiering express and initializing the app:
const express = require('express')

//requiering the cors middleware:
const cors = require('cors');
require('dotenv').config();

const { Pool } = require('pg') //this line is only needed for the PostgreSQL version
const pool = new Pool() //this line is only needed for the PostgreSQL version

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://Vefskolinn:${process.env.MONGOPASS}@cluster0.ftydf.mongodb.net/Blog?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
const app = express();
const PORT = 5002; //we will use port 5001


app.use(cors());//telling express to use the cors middleware
app.use(express.json())//telling express to accept json in body of POST requests

app.get('/',async (req,res)=>{ //listen to a get request
  const data = await pool.query('SELECT * from devices;')
  res.send(data.rows);
})

app.get('/p/blogs',async (req,res)=>{ //listen to a get request
  const data = await pool.query('SELECT * from blogs;')
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

app.post('/m/blog',async (req,res)=>{ //listen to a post request
  const collection = await client.db("Blog").collection("blogs");
  const result = await collection.insertOne(req.body)
  res.send(result);
  
})


app.listen(PORT, ()=>{ //listen to the port we chose above
    //print to the console that the server is listening
    console.log("listening to port: " + PORT);
})