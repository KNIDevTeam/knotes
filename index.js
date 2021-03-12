const express = require('express')

const app = express()

app.use(express.static('public'))

app.get('/test', (req, res) => {
  return res.send("testowa ścieżka")
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
