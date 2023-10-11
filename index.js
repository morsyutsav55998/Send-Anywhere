const express = require('express')
const multer = require('multer')

const app = express()
const fs = require('fs')
const path = require('path')
const port = 8000;
// Mongodb Offline

// const mongoose = require('mongoose')
// const db = mongoose.connection
// mongoose.connect('mongodb+srv://utsavgarchar:utsavgarchar@cluster0.wpvtcvx.mongodb.net/?retryWrites=true&w=majority')
// db.once('open', (err) => {

//     if (err) { 
//         console.log('DataBase Not Connected: ' + err)
//     } 
//     console.log("DataBase MongoDb Connected")
// })
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://utsav:utsavgarchar121@cluster0.wpvtcvx.mongodb.net',{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>{
    console.log('DB Connedcted')
}).catch(err => console.log(err))
const exampleSchema = new mongoose.Schema({
    images: {
        type: String,
    },
    type:{
        type:String
    }
})

const image = mongoose.model('images', exampleSchema)


const pdfSchema = new mongoose.Schema({
    pdfs: {
        type: String,
    },
    brouchertype:{
        type:String
    }
})


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const AVTAR_PATH = '/files'

const storage = multer.diskStorage({

    destination: (req, file, cd) => {
        cd(null, path.join(__dirname, '.', AVTAR_PATH))
    },
    filename: (req, file, cd) => {
 
        // var fileextension=path.extname(file.originalname)
        cd(null,
            Date.now() +Math.random()*888*88*888*888+ file.originalname)
    }
})

const upload = multer({
    storage
})
const pdf = mongoose.model('pdf', pdfSchema)
app.use('/files', express.static('files'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const imgpath = '/files/'
app.post('/upload', upload.single('file'), async (req, res) => {
    
    console.log(req.body);
    const file = req.file;
    const images = [];
    const pdfs = [];
    const filePath = imgpath + file.filename;
    if (file.mimetype === 'application/pdf' || req.body.type == 'broucher') {
        pdfs.push(filePath);
        await pdf.create({ pdfs: req.file.filename ,brouchertype:req.body.brouchertype})
   } else if(req.body.type == 'post'){
       images.push(filePath);
       await image.create({ images: req.file.filename ,type:req.body.type})
   } 
    res.redirect('/')
});


app.get('/', async (req, res) => {
    // var data = await images.find({})
    res.render('dd');
})

// Broucher
app.get('/broucher', async (req,res)=>{
    var data = await pdf.find({})
    res.render('broucher',{
        data:data
    })
})
app.get('/commercial', async (req,res)=>{
    const data = await pdf.find({brouchertype:'commercial'})
    res.render('commercial',{
        data:data

    })
})
app.get('/residential', async (req,res)=>{
    const data = await pdf.find({brouchertype:'residential'})
    res.render('residential',{
        data:data
    })
})
app.get('/video', async (req,res)=>{
    const data = await pdf.find({brouchertype:'video'})
    res.render('videos',{
        data:data

    })
})
// app.get('/industrial', async (req,res)=>{
//     const data = await pdf.find({brouchertype:'industrial'})
//     res.render('industrial',{
//         data:data

//     })
// })

app.get('/industrial', async (req,res)=>{
    const data = await pdf.find({brouchertype:'industrial'})
    res.render('industrial',{
        data:data

    })
})
app.get('/deletebroucher/:id', async (req, res) => {

    var data = await pdf.findById(req.params.id)
    fs.unlinkSync(path.join(__dirname, '/files/', data.pdfs))
    var da = await pdf.findByIdAndDelete(req.params.id)
    if (da) {
        res.redirect('back')
    }

})
// app.get('/downloadpost/:name', async (req, res) => {
//     console.log(req.params)
//     res.download(path.join(__dirname, '/files/', req.params.name))
// });
// Post
app.get('/post', async (req,res)=>{
    const data = await image.find({type:'post'})
    res.render('post',{
        data:data
    })
})
app.get('/deletepost/:id', async (req, res) => {

    var data = await image.findById(req.params.id)
    fs.unlinkSync(path.join(__dirname, '/files/', data.images))
    var da = await image.findByIdAndDelete(req.params.id)
    if (da) {
        res.redirect('back')
    }
})

app.get('/downloadbroucher/:name', async (req, res) => {
    console.log(req.params)
    res.download(path.join(__dirname, '/files/', req.params.name))
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
