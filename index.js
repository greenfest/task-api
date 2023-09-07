const express = require('express');
require('dotenv').config();
const cors = require('cors');
const tasks = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tasks", tasks);

app.use((err, _req, res) => {
    res.status(500).send("Uh oh! An unexpected error occured.")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});