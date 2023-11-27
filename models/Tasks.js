const db = require("../db/conn");

const taskSchema = new db.Schema({
    title: {
        type: String,
        default: "Task",
    },
    description: String,
    date: {
        type: Date,
        default: Date.now,
    },
    deadline: Date,
    userId: String,
    completed: {
        type: Boolean,
        default: false,
    },
    dateCompleted: Date,
    archived: {
        type: Boolean,
        default: false,
    }
});

const Tasks = db.model('Tasks', taskSchema);

module.exports = Tasks;