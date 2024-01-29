# Basic API for node.js
## usage of express - minimal web app framework for building API with node.js
-we defined routes as in index.js method/endpoint/data
### usage of sequelize - using as ORM library as its designed to work with relational databases . in our case postgres
we have defined model sensor-data in index.js
// Sync the model with the database
sequelize.sync();

other production Ready aspects
1. compression
2. helment
3. express-rate-limit 
4. JWT token for dummy authorization
5. pagination - default 5
6. Swagger yaml documentation
7. Swagger - api Validation - schema type