const express = require('express')
const util = require('./utill'); 
require('dotenv').config();
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require("express-rate-limit")
const jwt = require('jsonwebtoken')
const validator = require("./validator"); // Import the validator module

const {Sequelize, DataTypes} = require('sequelize')

//setting up connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
})

//Defining model
const SensorData = sequelize.define('sensor-data',{
    date:{
        type:DataTypes.DATE,
        allowNull:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:true
    },
    noOfYear:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    riskLvl:{
        type:DataTypes.STRING,
        allowNull:true
    }

})

const limiter = rateLimit({
    windowMs: 1*60*1000, //1 minute
    max:10 //limit each IP to 10 req per windowMs
});
//initialize
const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(limiter);

// Define a secret key for JWT
const secretKey = process.env.SECRET_KEY ||'whatamidoing';
app.post('/token',(req,res) => {
    //TODO: fetch user details in prod. using dummy user for dev
    const token = jwt.sign("yellow",secretKey);
    res.json({accessToken: token})
})


app.use((req, res, next) =>{
    //const statusCode = err.statusCode || 500
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
    next();
});
});

//await returns a promise object we need to use it with async
app.get('/data', 
    async (req,res) => {
    //pagination,default 5 if no param key with limit is defined
    let limit = req.query.limit || 500;
    let offset = req.query.offset || 0;
    const allData = await SensorData.findAll({limit,offset});
    res.status(200).send(allData);
    return;
})
app.post('/data', 
    validator.validate("post", '/data'),
    async (req,res) => {
        try{
            let data = req.body;
            const sensorData = await SensorData.create(data);
            res.status(201).send(sensorData);
            return;
        }
        catch(error){
            console.error('Error processing the request:', error);
            //Error handling
            //TODO: 1. handling errors in a file for now , to implement in a seperate kafka topic later
            //      2. Recovery pendinf to reprocess these messages 
            util.writeRequestBodyToFile(req.body, process.env.FILE_PATH || "./recoverable_errors.json");
            res.status(500).send('Internal Server Error');
            
        }
  
})

app.listen({port:8080},()=> {
    try{
        sequelize.authenticate();
        console.log("Connected to Database")
        sequelize.sync({alter:true});
    }
    catch(error){
        console.log("Couldn't connect to Database",error)
    }
    console.log("Server is running")
})