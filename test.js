const mongoose = require('mongoose');

async function main(){

    mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');  

    const listSchema = {
        name: String
    };

    const Item = mongoose.model("Item",listSchema) 

    const item1 = new Item({
        name: "Welcome to your todolist"
    })
    const item2 = new Item({
        name: "Hit + to add a new item"
    })
    const item3 = new Item({
        name: "<-- Hit this to delete an item"
    })

    await Item.insertMany([{name: "hi"},{name: "hello"},{name: "bye"}]);
    console.log("done");
}
main();