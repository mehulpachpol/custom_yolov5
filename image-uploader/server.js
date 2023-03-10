const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require("fs");
const path = require("path");
const fsExtra = require('fs-extra');
const PythonShell = require('python-shell').PythonShell;
const find = require('find-process');
const yaml = require('js-yaml');
const app = express();

app.use(express.static('public'))

const directory = "public/images/uploads";
const directoryDetect = "public/images/uploadsDetect";

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if(file.originalname.includes('detect')) {
        cb(null, 'public/images/uploadsDetect')
      } else {
        cb(null, 'public/images/uploads')
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage })

app.use(cors());


app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      imageUrl: `images/uploads/${req.file.filename}`
    });
  }
  else 
    res.status("409").json("No Files to Upload.")
  });

app.get('/delete', (req, res) => {
  fsExtra.emptyDirSync(directory);
  fs.readdir(directory, function(err, files) {
    if (err) {
       console.log("error hai ")
    } else {
      if(!files.length) {
        console.log("Empty  hai ")
        res.json({"success": true})
      }
    }
  });
});

app.get('/deletedetect', (req, res) => {
  fsExtra.emptyDirSync(directoryDetect);
  fs.readdir(directoryDetect, function(err, files) {
    if (err) {
      console.log("unexpected error")
    } else {
      if(!files.length) {
        console.log("Empty directory")
        res.json({"success": true})
      } 
    }
  });
});

app.get('/detectimg',DetectImage);

function DetectImage(req,res){
  let classes = req.header('classes')
  console.log(classes)
  var spawn = require("child_process").spawn;
  var process = spawn('python',["../yolov5/detect.py" , '--weights', '../yolov5/runs/train/exp/weights/NUT_BOLT_best.pt','--source', './public/images/uploadsDetect']);
  //var process = spawn('python',["../yolov5/train.py" ,'--data', '../yolov5/data/data.yaml', '--weights', 'yolov5s.pt', '--epochs',epoch , '--batch', batch ,'--img' ,img] );
  
  process.stdout.on('data', function(data) {
      res.json(data.toString());
  })
}


app.get('/name', callName);
  
function callName(req, res) {      
  // Use child_process.spawn method from 
  // child_process module and assign it
  // to variable spawn

  let batch = req.header('batchsize')
  let epoch = req.header('epochs')
  let img = req.header('image')
  let rate = req.header('rate')
  let scale = req.header('scale')
  let degree = req.header('degree')
  let momentum = req.header('momentum')

  console.log(batch);
  console.log(epoch);
  console.log(img);
  console.log(rate);
  console.log(scale);
  console.log(degree);
  console.log(momentum);

  let doc = yaml.safeLoad(fs.readFileSync('../yolov5/data/hyps/hyp.custom-hyper.yaml', 'utf8'));
  doc.scale = parseFloat(scale);
  doc.degrees = parseFloat(degree);
  doc.momentum = parseFloat(momentum);
  doc.lr0 = parseFloat(rate);
  console.log(doc);
  fs.writeFile('../yolov5/data/hyps/hyp.custom-hyper.yaml', yaml.safeDump(doc), (err) => {
      if (err) {
          console.log(err);
      }
  });
  console.log(doc);

  batch = batch.toString()
  epoch = epoch.toString()
  img  = img.toString()

  console.log(batch);

  var spawn = require("child_process").spawn;
    
  // Parameters passed in spawn -
  // 1. type_of_script
  // 2. list containing Path of the script
  //    and arguments for the script 
    
  // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
  // so, first name = Mike and last name = Will
  
  var process = spawn('python',["../yolov5/train.py" ,'--data', '../yolov5/data/data.yaml', '--weights', 'yolov5s.pt', '--epochs',epoch , '--batch', batch ,'--img' ,img] );
  // var process = spawn('python',["../test.py"] );
  console.log(`${epoch}`);

  // var process = spawn('python',["../yolov5/train.py" ,'--data', '../yolov5/data/data.yaml', '--weights', 'yolov5s.pt', '--epochs', '1', '--batch', '16' ,'--img' ,'640'] );

  // var process = spawn('python',["../yolov5/train.py" ]);
  // process.on('data', (data)=>{
  //   console.log('here: ', data.toString())
  // })


  // Takes stdout data from script which executed
  // with arguments and send this data to res object


  process.stdout.on('data', function(data) {
    console.log(data.toString())  
    res.json(data.toString());
  })
}

app.get('/pid',(req, res) => {
  pid_parent(req,res)
});

let flag = true;

function pid(req,res){
  find('name', "python")
  .then(function (list) {
    if(flag) {
      let flag2 = false;
      list.forEach((ele)=>{
        if(ele.cmd.search("train.py")!=-1) {    
          console.log(ele.pid)
          flag2 = true;
        }
        else{
          console.log("nhi bhai")    
        }
      })
      if(!flag2){
        flag = false;
        clearInterval(timeID);
        console.log("hello");
        reset_parameters();
        res.json({"success": true})         ////////Zollllllllllllllerrrrr
      }
    }
  },function (err) {
    console.log(err.stack || err);
  });
}

let timeID;

function reset_parameters(){
  let doc = yaml.safeLoad(fs.readFileSync('../yolov5/data/hyps/hyp.scratch-low.yaml', 'utf8'));
    console.log(doc);
    fs.writeFile('../yolov5/data/hyps/hyp.custom-hyper.yaml', yaml.safeDump(doc), (err) => {
      if (err) {
        console.log(err);
      }
    });
    console.log(doc);
}

function pid_parent(req,res){
  timeID = setInterval(()=>{pid(req,res)}, 2000);       // Daya kuch to gadbad hai 
}


app.get('/piddetect',(req, res) => {
  piddetect_parent(req,res)
});

let flagd = true;

function piddetect(req,res){
  find('name', "python")
  .then(function (list) {
    if(flagd) {
      let flag2 = false;
      list.forEach((ele)=>{
        if(ele.cmd.search("detect.py") != -1) {
          console.log(ele.pid)
          flag2 = true;
        }
        else{
          console.log("Other process")
        }
      })

      if(!flag2){
        flagd = false;
        clearInterval(timeIDdetect);
        console.log("after clear interval")
        res.json({"success": true})         ////////Zollllllllllllllerrrrr
      }
    }
  }, function (err) {
    console.log(err.stack || err);
  });
}


let timeIDdetect;

function piddetect_parent(req,res) {
  timeIDdetect = setInterval(()=>{piddetect(req,res)}, 2000);       // Daya kuch to gadbad hai 
}

const directoryExp = '../yolov5/runs/detect/exp'
const directoryLabels = '../yolov5/runs/detect/labels'

app.get('/deleteexp', (req, res) => {
  fsExtra.emptyDirSync(directoryExp);
  fs.readdir(directoryExp, function(err, files) {
    if (err) {
       console.log("unexpected error")
    } else {
      if(!files.length) {
        console.log("Empty directory")
        res.json({"success": true})
      }
    }
  });
});

app.get('/deletelabels', (req, res) => {
  fsExtra.emptyDirSync(directoryLabels);
  fs.readdir(directoryLabels, function(err, files) {
    if (err) {
       console.log("unexpected error")
    } else {
      if(!files.length) {
        console.log("Empty labels directory")
        res.json({"success": true})
      }
    }
  });
});

app.get('/datafile', (req, res) => {
  let doc = yaml.safeLoad(fs.readFileSync('../yolov5/data/data.yaml', 'utf8'));
  res.json({"datafile": doc})
})

const PORT = 5000;
app.listen(PORT);
console.log('api runnging on port: ' + PORT);