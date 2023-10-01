const db = require("../db/conn");

const taskSchema = new db.Schema({
    title: String,
    description: String,
    date: Date,
    deadline: Date,
    completed: Boolean
});

const Tasks = db.model('Tasks', taskSchema);

module.exports = Tasks;