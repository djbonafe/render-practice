require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const HttpError = require('./models/http-error'); // Adjust path if needed
const mongoose = require('mongoose');
const authenticationRoutes = require('./routes/authentication-routes')
const inviteesRoutes = require('./routes/invitees-routes')

const app = express()
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

//import the route file/files
app.get('/', (req, res) => {
  res.send('Welcome to Mirian and Jeo API 💍✨');
});

app.use('/api/auth', authenticationRoutes)
app.use('/api/invitees', inviteesRoutes)


app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});


//configure the mongoDb connection string
mongoose
  .connect(
    `mongodb+srv://dominic:dominic@samplecluster.rnemwca.mongodb.net/mirian-and-jeo?retryWrites=true&w=majority&appName=SampleCluster`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });




  

