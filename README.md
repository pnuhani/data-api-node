Basic API for node.js
#usage of express - minimal web app framework for building API with node.js
-we defined routes as in index.js method/endpoint/data
#usage of sequelize - using as ORM library as its designed to work with relational databases . in our case postgres
we have defined model sensor-data in index.js
// Sync the model with the database
sequelize.sync();

other production Ready aspects
compression
helment
express-rate-limit