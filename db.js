const mongoose = require('mongoose')

module.exports = async function  () {
    try {
        await mongoose.connect('mongodb://0.0.0.0:27017/lirary', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        console.log('DB connected');
    } catch (error) {
        console.log(error);
    }
}