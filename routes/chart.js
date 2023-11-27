const express = require("express");
const router = express.Router();
const moment = require('moment-timezone');
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

router.post('/', auth.required, async (req, res) => {
    const userId = req.auth.id || '';
    try {
        const tasks = await Task.find({ userId });

        const userTimezone = req.body.timezone || "Europe/Moscow";

        const currentMoment = moment().tz(userTimezone);
        const startOfWeek = currentMoment.clone().startOf('week');
        const endOfWeek = currentMoment.clone().endOf('week');

        const completedTasks = tasks.filter(task => {
            const taskDate = moment(task.completed ? task.dateCompleted : task.date).tz(userTimezone);
            return taskDate.isBetween(startOfWeek, endOfWeek, null, '[]') && task.completed;
        });

        const uncompletedTasks = tasks.filter(task => {
            const taskDate = moment(task.date).tz(userTimezone);
            return taskDate.isBetween(startOfWeek, endOfWeek, null, '[]') && !task.completed;
        });


        const groupByDayOfWeek = (tasks) => {
            const result = [0, 0, 0, 0, 0, 0, 0];

            tasks.forEach(task => {
                const dayOfWeek = moment(task.completed ? task.dateCompleted : task.date).tz(userTimezone).isoWeekday();
                result[dayOfWeek - 1] += 1;
            });

            return result;
        };

        const completedData = groupByDayOfWeek(completedTasks);
        const uncompletedData = groupByDayOfWeek(uncompletedTasks);

        res.status(200).json({
            series: [
                { name: 'Completed', data: completedData },
                { name: 'Uncompleted', data: uncompletedData },
            ],
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;