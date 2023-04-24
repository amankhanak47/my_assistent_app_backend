const connectToMongo=require("./database")
const express = require('express')

var cors = require('cors')



connectToMongo();

const app = express();
app.use(cors());
const port = process.env.PORT||3000
app.get('/', (req, res) => {
  res.send('hackelite')
})

app.use(express.json())


app.use('/auth', require('./routes/authentication.js'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})