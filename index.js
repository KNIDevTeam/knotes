const express = require('express')

const app = express()
 
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.set('view engine','ejs');

class List {
  url = [];
  content = [];
  title = [];
  constructor(){
    this.url=[];
    this.title=[];
    this.content=[];
  }
  addElement = (URL,TITLE, CONTENT)=>{
    this.url.push(URL);
    this.title.push(TITLE);
    this.content.push(CONTENT);
  }
  checkIfAdded = (URL)=>{
    if(this.url.indexOf(URL)!==-1) return true;
    else return false;
  }
  getTitleFromUrl = (URL)=>{
    return this.title[urlList.url.indexOf(URL)];
  }
  getContentFromUrl = (URL)=>{
    return this.content[urlList.url.indexOf(URL)];
  }
}

let urlList = new List;

app.get('/test', (req, res) => {
  return res.send("testowa ścieżka")
})

app.get('/', (req, res) => {
  return res.render('index');
})

app.post('/notes', (req,res)=>{
  urlList.addElement(
    req.body.oldUrl,
    req.body.title,
    req.body.content
  )
  return res.render('notes', {array: urlList})
})
app.get('/notes',(req,res)=>{
  return res.render('notes', {array: urlList})
})
app.use((req,res) => {
  if(urlList.checkIfAdded(req.url)==false){
    return res.render('nonWriten', {url: req.url});
  }else{
    return res.render('Written', {url: req.url, title: urlList.getTitleFromUrl(req.url), content: urlList.getContentFromUrl(req.url)});
  }
})


const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
