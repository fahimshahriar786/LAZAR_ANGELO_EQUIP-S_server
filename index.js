const express = require('express');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors())
app.use(express.json())

const verifyJWT=(req,res,next)=>{
    const authorizationHeader =req.headers.authorization;
    if(!authorizationHeader){
        return res.status(401).send({message:'Unauthorized Access'})
    }
    const token=authorizationHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if(err){
            return res.status(403).send({message:'Forbidden '})
        }
        console.log('Decoded',decoded);
        req.decoded=decoded;
      });
    
      
    next();
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jmokg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('gymEquipment').collection('product')
        const supplierInfoCollection = client.db('suppliers').collection('info')

        app.post('/setToken', async (req, res) => {

            const user = req.body
            console.log(user);
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '7d'
            })
            res.send({ accessToken })

        })
        
    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('warehouse is running and  waiting for data')
})
app.listen(port, () => {
    console.log('warehouse is running on port : ', port);
})