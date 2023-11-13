const express = require("express");
const router = express.Router();
const Task = require("../models/Tasks");

router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json({
            "completed": tasks.filter(task => task.completed === true),
            "uncompleted": tasks.filter(task => task.completed === false)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    let query = {_id: req.params.id};
    let result = await Task.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});


router.post("/", async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        date: new Date(),
        deadline: new Date(2023,9,10,17,0,0),
        completed: false
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch("/:id", async (req, res) => {
    const query = { _id: req.params.id };
    const updates = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        deadline: req.body.deadline,
        completed: req.body.completed
    };

    try {
        const result = await Task.updateOne(query, updates);
        const updatedTask = await Task.findById(req.params.id);
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const query = { _id: req.params.id };
    try {
        const result = await Task.deleteOne(query);
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Задача успешно удалена" });
        } else {
            res.status(404).json({ message: "Запись не найдена" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;