require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3001

// Autorise le cross-origin resource sharing
app.use(cors())
// Active la conversion du corps d'une requête en JSON
app.use(bodyParser.json())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})  