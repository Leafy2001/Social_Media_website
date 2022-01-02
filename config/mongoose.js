const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/codeial_development',
// {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true
//  }).then(() => {
//     console.log("Connected to Database");
//     }).catch((err) => {
//         console.log("Not Connected to Database ERROR! ", err);
//     }
// );

mongoose.connect(process.env.MONGODB_URL, 
{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
 }).then(() => {
    console.log("Connected to Database");
    }).catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

// db.once('open', function(){
//     console.log('Connected to Database :: MongoDB');
// });


module.exports = db;