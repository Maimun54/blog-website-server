
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app =express();
const cors = require('cors')
require('dotenv').config()
const port =process.env.PORT || 5000

//middleware 
app.use(cors())
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pl4mu3l.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const recentBlogCollection =client.db('ChildCareDB').collection('recentBlog');
    const allBlogCollection =client.db('ChildCareDB').collection('allBlog');
    const wishListBlogCollection =client.db('ChildCareDB').collection('wishlist');
    const newLetterCollection =client.db('ChildCareDB').collection('newLetter');

    app.get('/recentBlog',async(req,res)=>{
        const recentBlog = recentBlogCollection.find()
        const result =await recentBlog.toArray()
        res.send(result)
    })
    app.post('/subscribe',async(req,res)=>{
      const newBlog =req.body
      const result = await newLetterCollection.insertOne(newBlog)
      res.send(result)
   })
    app.post('/allBlog',async(req,res)=>{
      const newBlog =req.body
      const result = await allBlogCollection.insertOne(newBlog)
      res.send(result)
   })
     app.get('/allBlog',async(req,res)=>{
      const queryObj ={}
      const category =req.query.category;
      if(category){
        queryObj.category=category
      }
      const cursor =allBlogCollection.find(queryObj)
      const result =await cursor.toArray()
      res.send(result)
    })
     app.get('/allBlog/:id',async(req,res)=>{
      const id =req.params.id;
      const query ={_id:new ObjectId(id)}
      const result =await allBlogCollection.findOne(query)
      
      res.send(result)
    })
    app.post('/wishlist',async(req,res)=>{
      

      const wishList =req.body
      const result = await wishListBlogCollection.insertOne(wishList)
      res.send(result)
   })
   
   app.get('/wishlist',async(req,res)=>{
    console.log(req.query.email)
    // const query=req.body
    let query ={};
    // if(req.query.email !==req.user?.email){
    //   return res.status(403).send({message:'forbidden access'})
    // }
    if(req.query?.email){
      query ={email: req.query.email}
    }
    const cursor =wishListBlogCollection.find(query)
    const result =await cursor.toArray()
    res.send(result)
  })

  //update data by id
  app.put('/allBlog/:id',async(req,res)=>{
    const id =req.params.id
    const filter ={_id: new ObjectId(id)}
    const options = { upsert: true };
     const updateBlog=req.body;
     const blogPost ={
    $set:{    
      
      title:updateBlog.title,
      category:updateBlog.category,
      image:updateBlog.image,
      description:updateBlog.description,
      date:updateBlog.price,
      long_description:updateBlog.long_description,
      
    }
  }
  const result = await allBlogCollection.updateOne(filter,blogPost,options)
   res.send(result)
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Blog website System is Running')
})

app.listen(port,()=>{
    console.log(`Blog website system is running Port${port}`);
})