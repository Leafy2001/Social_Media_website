const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/codeial_development');
mongoose.connect('mongodb+srv://shashank_1234:dellinspiron@cluster0.qmcyz.mongodb.net/myFirstDatabase?authSource=admin&retryWrites=true&w=majority', 
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

// mongoose.connect(process.env.MONGODB_URI, 
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
// mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;