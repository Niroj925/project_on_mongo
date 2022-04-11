
const express=require('express');
const app = express();
const bodyParser=require('body-parser');
const path=require('path');
const mongoose = require('mongoose');
const viewpath=path.join(__dirname, './view');

 app.set('view engine', 'ejs');
app.set('views',viewpath);

app.use(bodyParser.urlencoded({ extended: true}));

//connect with mongodb 
mongoose.connect('mongodb://localhost:27017/meroList');//meroList is created db
 //mongoose schema
 const listSchema ={
    msg:String
 }
//schema model
 const itemlist = mongoose.model('item', listSchema);//item is collection
  
const item1=new itemlist({
  msg:'hello world'
});
const item2=new itemlist({
    msg:'hello '
  });
  const item3=new itemlist({
    msg:'world'
  });
  //default lists
let defaultItems=[item1,item2,item3];

 app.get('/', function(req, res){

     itemlist.find({},function(err,founditem){
         //check condtion to insert if empty then only else not
         if(founditem.length===0)
         { 
          //insert all items 
            itemlist.insertMany(defaultItems, function(err){
             if(err){
             console.log(err);
                }else{
                console.log('default iteme added ');
                 }
           });
           res.redirect('/');
         }else{
           res.render('profile',{content:founditem});
          // res.redirect('/');
         }
     });  
 });
 
 app.post('/', function (req, res){
     const itemName=req.body.newItem;
     console.log(itemName);
      const addedItem=new itemlist({
          msg:itemName
      });
      addedItem.save();
      res.redirect('/');
 })
//delete item if checked
 app.post('/delete',function(req,res){
     const checkItem=req.body.cbox;
     console.log(checkItem);
     itemlist.deleteOne({_id:checkItem},function(err){
         if(err){
             console.log(err);
         }else{
             console.log('deleted one item');
         }
       res.redirect('/');
     })
 })

 app.listen(2600,function(){
     console.log('listening on port 2600');
 })
