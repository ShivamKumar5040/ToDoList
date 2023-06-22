const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');  

const itemSchema = {
  name: String
};
const listSchema = {
  name: String,
  items: [itemSchema]
}

const Item = mongoose.model("Item",itemSchema);
const List = mongoose.model("List",listSchema);

const item1 = new Item({
    name: "Welcome to your todolist"
})
const item2 = new Item({
    name: "Hit + to add a new item"
})
const item3 = new Item({
    name: "<-- Hit this to delete an item"
})

app.get("/", async function(req, res) {
  const items = await Item.find();

  if(items.length === 0){
    await Item.insertMany([item1,item2,item3]);
    res.redirect("/");
  }else{
    res.render("list", {listTitle: "Today", newListItems: items});
  }
});

app.get("/:customListName", async(req,res)=>{
  const lists = await List.findOne({name: _.capitalize(req.params.customListName)});
  if(lists === null){
    const list = new List({
      name: _.capitalize(req.params.customListName),
      items: [item1,item2,item3]
    })
    await list.save();
    let url = "/"+req.params.customListName;
    res.redirect(url);
  }else{
    res.render("list", {listTitle: _.capitalize(lists.name), newListItems: lists.items});
  }
})

app.post("/", async function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  })
  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }else{
    const list = await List.findOne({name: listName});
    list.items.push(item);
    list.save();
    res.redirect("/"+listName);
  }
});

app.post("/delete",async (req,res)=>{
  if(req.body.listName === "Today"){
    await Item.deleteOne({_id: req.body.checkbox});
    res.redirect("/");
  }else{
    await List.findOneAndUpdate({name: req.body.listName}, {$pull: {items: {_id: req.body.checkbox}}});
    res.redirect("/"+req.body.listName);
  }
})

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
