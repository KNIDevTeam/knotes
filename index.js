const express = require('express')

const app = express()

app.use(express.static('public'))

app.get('/test', (req, res) => {
  return res.send("testowa ścieżka")
})

app.use('/index', (req, res)=>{
  return res.sendFile('./public/index.html', {root: __dirname});
});

app.use((req, res)=>{
  return res.sendFile('./public/edit.html', {root: __dirname});
});

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
