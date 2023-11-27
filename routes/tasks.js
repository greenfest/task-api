const express = require("express");
const router = express.Router();
const Task = require("../models/Tasks");
const { expressjwt: jwt } = require('express-jwt');


const auth = {
    required: jwt({
        secret: 'secret',
        algorithms: ["HS256"],
        credentialsRequired: true,
        requestProperty: 'auth',
    }),
    optional: jwt({
        secret: 'secret',
        algorithms: ["HS256"],
        credentialsRequired: false,
    }),
};


router.get("/", auth.required, async (req, res) => {
    const userId = req.auth.id ? req.auth.id : "";
    try {
        const tasks = await Task.find({ userId });
        res.json({
            "completed": tasks.filter(task => task.completed === true),
            "uncompleted": tasks.filter(task => task.completed === false)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", auth.required, async (req, res) => {
    let query = {_id: req.params.id};
    let result = await Task.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});


router.post("/", auth.required, async (req, res) => {
    const userId = req.auth.id ? req.auth.id : "";
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        userId: userId,
        deadline: new Date((req.body.deadline) ? (req.body.deadline) : Date.now()),
        completed: false
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch("/:id", auth.required, async (req, res) => {
    const query = { _id: req.params.id };
    const updates = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        deadline: req.body.deadline,
        completed: req.body.completed,
        dateCompleted: req.body.dateCompleted
    };

    try {
        await Task.updateOne(query, updates);
        const updatedTask = await Task.findById(req.params.id);
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", auth.required, async (req, res) => {
    const query = { _id: req.params.id };
    try {
        const result = await Task.deleteOne(query);
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Задача успешно удалена", error: false });
        } else {
            res.status(404).json({ message: "Запись не найдена", error: true });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;