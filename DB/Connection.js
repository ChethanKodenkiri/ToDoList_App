const mongoose = require('mongoose');

//Connect the data base
const database = process.env.DATABASE;
mongoose.connect(database).then(()=>{
    console.log('Connected succefully ....')}).catch((err)=>{
        console.log('connection unsuccesfull... Reason for that :  '+ err);
    });