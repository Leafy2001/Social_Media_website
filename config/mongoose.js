const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URL, {
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


module.exports = db;