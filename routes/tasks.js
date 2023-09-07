const express = require("express");
const db = require("../db/conn.js");


const router = express.Router();


// Определение схемы
const taskSchema = new db.Schema({
    title: String,
    description: String,
    completed: Boolean
});

const Task = db.model('Task', taskSchema);

// Get a list of 50 posts
router.get("/", async (req, res) => {
    // let collection = await db.collection("tasks");
    // let results = await collection.find({})
    //     .limit(50)
    //     .toArray();
    //
    // res.send(results).status(200);
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// // Fetches the latest posts
// router.get("/latest", async (req, res) => {
//     let collection = await db.collection("tasks");
//     let results = await collection.aggregate([
//         {"$project": {"author": 1, "title": 1, "tags": 1, "date": 1}},
//         {"$sort": {"date": -1}},
//         {"$limit": 3}
//     ]).toArray();
//     res.send(results).status(200);
// });
//
// // Get a single post
// router.get("/:id", async (req, res) => {
//     let collection = await db.collection("tasks");
//     let query = {_id: ObjectId(req.params.id)};
//     let result = await collection.findOne(query);
//
//     if (!result) res.send("Not found").status(404);
//     else res.send(result).status(200);
// });

// Add a new document to the collection
router.post("/", async (req, res) => {
    // let collection = await db.collection("tasks");
    // let newDocument = req.body;
    // newDocument.date = new Date();
    // let result = await collection.insertOne(newDocument);
    // res.send(result).status(204);
    const task = new Task({
        title: req.body.title, // Предполагается, что в запросе есть поле title
        description: req.body.description, // Предполагается, что в запросе есть поле description
        completed: false // Новая задача будет не завершена
    });

    try {
        const newTask = await task.save(); // Сохраняем новую задачу в базу данных
        res.status(201).json(newTask); // Возвращаем JSON с новой задачей
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// // Update the post with a new comment
// router.patch("/comment/:id", async (req, res) => {
//     const query = { _id: ObjectId(req.params.id) };
//     const updates = {
//         $push: { comments: req.body }
//     };
//
//     let collection = await db.collection("tasks");
//     let result = await collection.updateOne(query, updates);
//
//     res.send(result).status(200);
// });
//
// // Delete an entry
// router.delete("/:id", async (req, res) => {
//     const query = { _id: ObjectId(req.params.id) };
//
//     const collection = db.collection("tasks");
//     let result = await collection.deleteOne(query);
//
//     res.send(result).status(200);
// });

module.exports = router;