//module.exports= getDate;
//export is a type object so it has methods we can use methods
//module.exports.getDate=getDate();
//module.exports == exports so we can just right exports insted of module.exports 

//exports.getDate =getDate;
//insted of so many get date we can make a function as anonymous function and we can reduce the repetition of getDate

exports.getDate =function(){
 
    const options={
    weekday:'long',
    month:'long',
    day:'numeric'
    };

    const today = new Date();
    return today.toLocaleDateString("en-US",options);
   
}

//module.exports.getDay=getDay;
exports.getDay = function(){

    const options={
       weekday:'long'
    };

    const today=new Date();
    return today.toLocaleTimeString('en-US',options);
}