const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  title: String,
  path: String,
  price: Number,
  ordered: {type: Number, default: 0},
  selected: {type: Boolean, default: false},
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
/*app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  console.log("Post Photo"+req.file.filename);
  res.send({
    path: "/images/" + req.file.filename
  });
});*/

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/items', async (req, res) => {
  const item = new Item({
    title: req.body.title,
    path: req.body.path,
    price: req.body.price,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/items/:id', async (req, res) => {
  let item = await Item.findOne({_id:req.params.id});
  console.log(item.title);
  item.selected = !item.selected;
  item.save();
  console.log(item.selected);
});
  
app.put("/api/items/:id/ordered", async (req, res) => {
  let item = await Item.findOne({_id:req.params.id});
  item.ordered = item.ordered + 1;
  item.save();
  console.log(item.title);
  console.log(item.ordered);
});

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/items/:id', async (req,res) => {
  try{
    console.log(req.params);
    let item = await Item.deleteOne({_id:req.params.id});
    res.send(item);
  }catch(error){
    console.log(error);
  }
});

app.put('/api/items/:id', async (req,res) => {
  try{
    console.log(req.params);
    let item = await Item.findOne({_id:req.params.id});
    item.title = req.body.title;
    item.price = req.body.price;
    item.save();
    console.log(req.body);
    res.send(item);
  }catch(error){
    console.log(error);
  }
});

app.listen(4200, () => console.log('Server listening on port 4200!'));
