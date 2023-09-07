const mongoose = require('mongoose');
const dbURI = process.env.DB_URI || "";

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log(`Mongoose подключено к ${dbURI}`);
});

mongoose.connection.on('error', err => {
    console.log('Ошибка подключения к базе данных:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose отключено');
});

module.exports = mongoose;