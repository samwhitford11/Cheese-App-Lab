// DEPENDENCIES
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");// debugging package
const cors = require("cors");

const { PORT= 4011, DATABASE_URL } = process.env;

const app = express();

// DATABASE CONNECTION
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewURLParser: true
});
// CONNECTION EVENTS    
mongoose.connection
    .on("open", () => console.log('you are connected to mongoose'))
    .on("close", () => ('You are disconnected from mongoose'))
    .on("error", (error) => console.log(error));

// MODELS   
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

// MIDDLEWARE
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ROUTES
// test route
app.get('/', (req, res) => {
    res.send("I'm just crackers about cheese");
});

// index route
app.get('/cheese', async (req, res) => {
    try{
        res.json(await Cheese.find({}));
    }catch(error){
        res.status(400).json(error)
    }
});

// create route
app.post('/cheese', async (req, res) => {
    try{
        res.json(await Cheese.create(req.body));
    }catch(error){
        res.status(400).json(error)
    }
});

// update route
app.put('/cheese/:id', async (req, res) => {
    try {
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true})
        );
    }catch(error){
        res.status(400).json(error)
    }
});

// delete route
app.delete('/cheese/:id', async (req, res) => {
    try{
        res.json(await Cheese.findByIdAndDelete(req.params.id));
    }catch(error){
        res.status(400).json(error)
    }
});

// index route
app.get('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findById(req.params.id));
    }catch(error){
        res.status(400).json(error)
    }
});

//LISTENER
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));