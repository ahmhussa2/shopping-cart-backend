const data = require('./db')
const express = require('express');
var sha256 = require('js-sha256');
const app = express();
var path = require('path');
const PORT = 9000;
var cors = require('cors');
const fs = require('fs');
var bodyParser = require('body-parser')


app.use(cors());
app.use("/images", express.static(path.join("./static/images/cart.svg")));  

app.use(express.urlencoded());

app.use(express.json());
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/register', function(req, res) {
  const user = {
    firstname: req.body.user.firstname,
    lastname: req.body.user.lastname,
    email: req.body.user.email,
    password: sha256(req.body.user.password)
  }
  var data = fs.readFileSync('./db.json');
  var myObject= JSON.parse(data);
  myObject.users.push(user);
  var newData = JSON.stringify(myObject);
  fs.writeFile('./db.json', newData, err => {
      if(err) throw err;
      console.log("New data added");
  }); 

  res.status(200).json({status:'success'});
});


app.post('/login', function(req, res) {
  const user = {
    email: req.body.user.email,
    password: sha256(req.body.user.password)
  }
  var data = fs.readFileSync('./db.json');
  var myObject= JSON.parse(data);
  myObject.users.map((item, index) => {
    if (user.email === item.email && user.password === item.password) {
      console.log(user.email)
      console.log(item.password)
      console.log(user.email)
      console.log(item.password)
      res.status(200).json({status:'success'});
    }
  });
});

app.get('/products', (req, res) => {
  res.json({"products": data.products});
});

app.get('/banners', (req, res) => {
  res.json({"banners": data.banners});
});

app.get('/categories', (req, res) => {
  res.json({"categories": data.categories});
});

app.get('/getimages', (req, res) => {
  res.sendFile('./static/images/'+req.params.path, { root: __dirname });
});

app.get('/images/lowest-price.png', (req, res) => {
  res.sendFile('./static/images/lowest-price.png', { root: __dirname });
});


app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});