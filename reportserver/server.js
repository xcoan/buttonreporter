// Declare global variables
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const app = express()

// EJS for views
app.set('view engine', 'ejs')

//body-parser for mongo
app.use(bodyParser.urlencoded({extended: true}))

// public folder
app.use(express.static('public'))

var db
// Connect to MLAB mongoDB instance
MongoClient.connect(`mongodb://dbuser:dbpass@ds131320.mlab.com:31320/learn-mongo-db`, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})


app.get('/', (req, res) => {
  db.collection('reports').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {reports: result})
  })
})

// Creates new quote document with given name and quote
app.post('/reports/:source', (req, res) => {
  // Current time for timestamp
  var date = new Date()
  var src = req.params.source
  db.collection('reports').save({ timestamp: date.toISOString(), source: src}, (err, result) => {
    if (err) return console.log(err)

    res.send(result)
    console.log(result)
  })
})
