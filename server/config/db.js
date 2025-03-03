const { default: mongoose } = require("mongoose");

connectDB = () =>{
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("MongoDB connection error:", err));
}

module.exports = connectDB;