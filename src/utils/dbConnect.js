const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("conectado 🚀");
    } catch (error) {
        console.log(error);
    }
};

module.exports = dbConnect;
