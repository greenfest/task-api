import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Функция для получения задач с бэкенда
export const getTasks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tasks`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

// Функция для отправки обновлений задач на бэкенд
export const updateTask = async (task) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/tasks/${task.id}`, task);
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};