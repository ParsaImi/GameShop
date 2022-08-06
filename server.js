const mongoose = require('mongoose')
const app = require('./app')
const dotenv = require('dotenv');
// const { use } = require('./tourRoutes');

process.on("uncaughtException" , err => {
    console.log(err.name , err.message);
        process.exit(1)

})

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



const server = app.listen(8000 , () => {
    console.log('server is waiting brooo');
})

process.on("unhandledRejection" , err => {
    console.log(err.name , err.message);
    server.close(() => {
        process.exit(1)

    })
})

