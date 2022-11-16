const express = require('express');
const app = express();
const bodyParse= require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash')
app.set('view engine', 'ejs');



app.use(bodyParse.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://admin:ChethanDB@cluster0.tw0yrov.mongodb.net/todoListDB');
//Schema
const itemSchema = new mongoose.Schema({
    name: String
});
//Model
const Item= new mongoose.model("Item",itemSchema);

const item1 =new Item({
   name:"Welcome to your todo list!"
});

const item2 =new Item({
    name:"Hit the + button to add a new item"
});

const item3 =new Item({
    name:"<-- Hit this to delete an item"
});

const defaultItems =[item1,item2,item3];

const listSchema = new mongoose.Schema({
    name:String,
    items:[itemSchema]
});

const List = mongoose.model("List",listSchema);


app.get("/", function(req,res){
    
    Item.find({},function(err,foundItem){
        if(foundItem.length=== 0){    
            Item.insertMany(defaultItems,function (err){
            if(err){
                console.log(err);
            }
            else{
                console.log("Successfully logged data to dataBase!")
            }
            });
            res.redirect("/");
            }
            else{
                res.render('list',{listTitle:"Today",kindOfItems:foundItem})
            }
      
    })
});




app.post("/", function(req,res){
   const itemName = req.body.newItems;
   const listName = req.body.list;

    const item = new Item({
        name:itemName
    });
    
    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName} , function(err,foundList){
            if(err){
                console.log(err);
            }
            else{
               // console.log("What is inside Found list"+foundList)
                foundList.items.push(item);
                foundList.save();
               // console.log("What is inside Found list"+foundList)
                res.redirect("/"+listName);
            }
        })
    }
});

app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                console.log("Successfully Deleted checked Item");
                res.redirect("/")
            }  
        })
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
            res.redirect("/"+listName);
        })
    }
})

app.get("/:customName", function(req,res){
    const customlistName = _.capitalize(req.params.customName);
    List.findOne({name:customlistName},function(err,foundList){
        if(err){
            console.log(err)
        }
        else{
            if(!foundList){
               
                //Create New List
                const list = new List({
                    name:customlistName,
                    items:defaultItems
                });
                list.save();
                res.redirect("/"+customlistName);
            }
            else{
               
                //Show existing list
                res.render('list',{listTitle:foundList.name,kindOfItems:foundList.items})
            }
        }
    })
});

let port = process.env.PORT;
if(port == null || port==""){
    port =3000;
}

app.listen(port, function(){
    console.log("Server is running.....")
})