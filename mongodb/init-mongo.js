// Используем базу данных task-app
db = db.getSiblingDB('task-app');

// Создаем коллекцию tasks
db.createCollection('tasks');

db.getSiblingDB('task-app').createUser({user: 'task', pwd: '1234', roles: ['readWrite']})