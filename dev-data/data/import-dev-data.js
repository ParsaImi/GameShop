const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')
dotenv.config({path : './config.env'})

const { DATABASE } = process.env;
const { DATABASE_PASSWORD } = process.env;
const dbAdress = DATABASE.replace('<PASSWORD>' , DATABASE_PASSWORD)

mongoose.connect(dbAdress , {
    useNewUrlParser : true,
    useCreateIndex : true ,
    useFindAndModify : false
}).then(() => {
    console.log('app connected to DataBase');
}
)

const tours = JSON.parse(fs.readFileSync(`${__dirname}/json.json`));

async function importData(){
    try{
        await Tour.create(tours)
        console.log('data succesfuly loaded');
        process.exit();
    }catch(err){
        console.log(err);
    }
}


////// DeleteCurentData

async function deleteData(){
    try{
        await Tour.deleteMany()
        console.log('data succesfuly Deleted');
        process.exit()
    }catch(err){
        console.log(err);
    }
}

if(process.argv[2] === '--import'){
    importData()
}else if(process.argv[2] === '--delete'){
    deleteData()
}



