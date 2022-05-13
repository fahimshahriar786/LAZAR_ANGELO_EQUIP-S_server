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



//---