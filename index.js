const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mern.atgqzad.mongodb.net/?retryWrites=true&w=majority&appName=MERN`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const productCollection = client.db('emajhon').collection('products');
    
    app.get('/products', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.skip(page * size).limit(size).toArray();
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count, products });
    });

    app.post('/productsById', async (req, res) => {
      const ids = req.body;
      const objectIds = ids.map(id => new ObjectId(id)); // Corrected here
      const query = { _id: { $in: objectIds } };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
  } finally {
    // Ensure the client will close when you finish/error
  }
}

run().catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('ema john');
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
