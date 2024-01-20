const express = require('express')
require('dotenv').config();
const {Sequelize, DataTypes} = require('sequelize')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require("express-rate-limit")
const jwt = require('jsonwebtoken')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
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
//TODO: To be secured. 
const secretKey = 'whatamidoing';
app.post('/token',(req,res) => {
    //TODO: fetch user details in prod. using dummy user for dev
    const token = jwt.sign("yellow",secretKey);
    res.json({accessToken: token})
})


app.use((req, res, next) =>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Forbidden' });
        }
    next();
});
});

//defining model

const SensorData = sequelize.define('sensor-data',{
    serial:{
        type:DataTypes.STRING,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    temperature:{
        type:DataTypes.FLOAT,
        allowNull:false
    }

})



//await returns a promise object we need to use it with async
app.get('/data', async (req,res) => {
    //pagination,default 5 if no param key with limit is defined
    let limit = req.query.limit || 5;
    let offset = req.query.offset || 0;
    const allData = await SensorData.findAll({limit,offset});
    res.status(200).send(allData);
    return;
})
app.post('/data', async (req,res) => {
    let data = req.body;
    const sensorData = await SensorData.create(data);
    res.status(201).send(sensorData);
    return;
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