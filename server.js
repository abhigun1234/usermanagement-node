const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

var { User } = require('./models/users.js');

mongoose.Promise = global.Promise;

var db = mongoose.connect('mongodb://localhost:27017/Register');

// mongoose.connection.once('connected', function() {
// 	console.log("Connected to database")
// });


var app = express();

app.use(express.static(__dirname + 'views'));
app.use(express.static(__dirname + '/views'));
//app.use(express.static(__dirname  + '/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/registration', (req, res) => {
    res.render('registration');
})



app.get('/', (req, res) => {
    res.render('login');
});




// app.post('/loggedin', (req, res) => {
//   console.log("hello")
//         User.findOne({
//             email: req.body.lUsername,
//             password: req.body.lPassword
//         }).then((docs) => {
//             if (docs === null) {
//                 return res.status(400).send('<h1>Wrong Password and Email</h1>');
//             }
//             return res.render('page', { files: files });
//         }, (e) => {
//             res.status(404).send(e);
//         })
// });


app.post('/registered', (req, res) => {

    var user = new User({
        name: req.body.name,
        age: req.body.age,
        contact: req.body.number,
        email: req.body.email,
        password: req.body.password
    });

    user.save().then((docs) => {

        //res.send('<h1>Registration complete</h1>');  
        res.redirect('/');

    }, (e) => {
        res.status(404).send('Oops Something went Wrong.Plz Register Again');
        console.log(e);
    })

});

app.use(methodOverride('_method'));

mongoose.createConnection('mongodb://localhost:27017/mongoupload');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

// Init gfs
let gfs;

db.once('open', () => {
  // Init stream
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/mongoupload',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// @route GET /
// @desc Loads form
app.post('/loggedin', (req, res) => {
  console.log( "gfs.files", gfs.files)
  // res.send("hello")
  // alert(gfs.files)
  files=[]
  res.render('page', { files: files });
  // gfs.files.find().toArray((err, files) => {
  
  //   // Check if files
  //   if (!files || files.length === 0) {
  //     res.render('page', { files: false });
  //   } else {
  //     files.map(file => {
  //       if (
  //         file.contentType === 'image/jpeg' ||
  //         file.contentType === 'image/png'
  //       ) {
  //         file.isImage = true;
  //       } else {
  //         file.isImage = false;
  //       }
  //     });
  //     res.render('page', { files: files });
  //   }
  // });
});

// @route POST /upload
// @desc  Uploads file to DB
app.post('/upload', upload.single('file'), (req, res) => {
  // res.json({ file: req.file });
  res.redirect('/loggedin');
});

// @route GET /files
// @desc  Display all files in JSON
app.get('/files', (req, res) => {
  console.log("intered here")
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

// @route GET /image/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
app.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/loggedin');
  });
});



app.listen(3000, () => {
    console.log('connection on 3000');
})