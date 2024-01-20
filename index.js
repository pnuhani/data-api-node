const express = require('express')
require('dotenv').config();
const {Sequelize, DataTypes} = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
})
//initialize
const app = express();
app.use(express.json());

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
    const allData = await SensorData.findAll();
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