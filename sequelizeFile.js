const {Sequelize, DataTypes} = require('sequelize')

//setting up connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
})

//Defining model
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
module.exports = SensorData;
module.exports = sequelize;