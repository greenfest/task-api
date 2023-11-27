const express = require('express');
require('dotenv').config();
require('./models/Users');
require('./config/passport');
const cors = require('cors');
const tasks = require('./routes/tasks');
const chart = require('./routes/chart');
const users = require('./routes/users');
const app = express();

app.use(cors());
app.use(express.json());

app.use("/tasks", tasks);
app.use("/chart", chart);
app.use("/users", users);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});