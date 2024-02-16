const exphbs = require('express-handlebars');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Mock data for file listing
let uploadedFiles = [];

app.engine('.hbs', exphbs.engine({ extname: '.hbs', layoutsDir: 'views/layouts/' }));
app.set('view engine', '.hbs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('upload');
});

app.post('/upload', upload.single('file'), (req, res) => {
    
    if (!req.file || req.file.size === 0) {
        return res.status(400).send('Empty file cannot be uploaded.');
    }

    
    uploadedFiles.push(req.file.originalname);
    res.redirect('/list');
});

app.get('/list', (req, res) => {
    res.render('list', { files: uploadedFiles });
});

app.get('/delete', (req, res) => {
    res.render('delete', { files: uploadedFiles });
});

app.post('/delete', (req, res) => {
    const fileNameToDelete = req.body.fileName;

    
    uploadedFiles = uploadedFiles.filter(file => file !== fileNameToDelete);

    res.redirect('/list');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
