const db = require("../db/conn");

const taskSchema = new db.Schema({
    title: String,
    description: String,
    date: Date,
    deadline: Date,
    userId: String,
    completed: Boolean,
    dateCompleted: Date,
});

const Tasks = db.model('Tasks', taskSchema);

module.exports = Tasks;