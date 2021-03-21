// const express = require('express')
// const fs = require('fs')

// const app = express()

// app.use(express.static('public'))
// app.use(express.urlencoded({extended: true}))

// app.set('view engine','ejs');

// class List {
//   url = [];
//   content = [];
//   title = [];
//   constructor(){
//     this.url=[];
//     this.title=[];
//     this.content=[];
    
//   }
//   addElement = (URL,TITLE, CONTENT)=>{
//     this.url.push(URL);
//     this.title.push(TITLE);
//     this.content.push(CONTENT);
//   }
//   checkIfAdded = (URL)=>{
//     return this.url.indexOf(URL) !== -1;
//   }
//   getTitleFromUrl = (URL)=>{
//     return this.title[urlList.url.indexOf(URL)];
//   }
//   getContentFromUrl = (URL)=>{
//     return this.content[urlList.url.indexOf(URL)];
//   }
//   save = (URL)=>{
//   // creates dir notes if it does not exist and then saves the note as json
//     if (!fs.existsSync('./notes')) { fs.mkdirSync('./notes'); }
//     let dataJSONED = {url: URL, title: this.getTitleFromUrl(URL), content: this.getContentFromUrl(URL)};
//     try{
//       fs.writeFileSync("./notes"+URL, JSON.stringify(dataJSONED))
//     }catch(err){
//       console.err(err);
//     }
//   }
//   read = (URL)=>{
//     if (!fs.existsSync('./notes')) { fs.mkdirSync('./notes'); }
//     try {
//       return fs.readFileSync("./notes" + URL, 'utf8')
//     }
//     catch (err) {
//       console.error(err)
//     }
//   }
//   load =(URL)=>{
//     let data="", decoded={};
//     data=urlList.read(URL);

//     if(typeof(data)=="boolean"){
//       console.err("Error reading data!")
//       return;
//     }else{
//       decoded = JSON.parse(data);
//     }
//     if(this.checkIfAdded(URL)){
//       this.title[urlList.url.indexOf(URL)]=decoded.title;
//       this.content[urlList.url.indexOf(URL)]=decoded.content;
//     }else{
//       this.addElement(decoded.url, decoded.title, decoded.content)
//     }
//   }

//   populate = ()=>{
//     //populates list with existing notes
//     if (fs.existsSync('./notes')) {
//       fs.readdirSync("./notes/").forEach(file =>{
//         this.load("/"+file);
//       })
//     }
//   }
// }

// checkIfExists = (URLpath) => {
//   try {
//     if (fs.existsSync("./notes"+URLpath)) {
//       return true
//     }
//   } catch(err) {
//     console.error(err)
//     return false
//   }

// }

// let urlList = new List;
// urlList.populate();

// app.get('/test', (req, res) => {
//   return res.send("testowa ścieżka")
// })

// app.get('/', (req, res) => {
//   return res.render('index', { title: "title" });
// })

// app.post('/notes', (req,res)=>{
//   urlList.addElement(
//     req.body.oldUrl,
//     req.body.title,
//     req.body.content
//   )
//   urlList.save(req.body.oldURL)
//   return res.render('notes', {array: urlList})
// })
// app.get('/notes',(req,res)=>{
//   return res.render('notes', {array: urlList})
// })
// app.use((req,res) => {
//   if(urlList.checkIfAdded(req.url)===false){
//     return res.render('nonWriten', {url: req.url});
//   }else{
//     return res.render('Written', {url: req.url, title: urlList.getTitleFromUrl(req.url), content: urlList.getContentFromUrl(req.url)});
//   }
// })


// const PORT = process.env.PORT || 8080

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
