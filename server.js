const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios'); 
const modelsRoute = require('./routes/modelsRoutes');
const tasksRoute = require('./routes/tasksRoutes'); 
const projectRoute = require('./routes/projectroutes'); 
const app = express();
const port = process.env.PORT || 9090;



mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://ahmedmaadi19:Ahmedmaadimido19@ahmed.uiec5dx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`Connected to MongoDB`);
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(express.json());

// Function to generate steps based on task title using Python Flask app
const generateSteps = async (title) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/task-title', { title });
        return response.data.text;
    } catch (error) {
        console.error('Error while generating steps:', error);
        return null;
    }
};

// Route to get a task by its ID
app.get('/task/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Extract title from the task
        const title = task.title;

        // Generate steps based on the title
        const steps = await generateSteps(title);

        if (!steps) {
            return res.status(500).json({ message: 'Error generating steps' });
        }

        res.status(200).json({ task, steps });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.use('/', modelsRoute);
app.use('/', tasksRoute);
app.use('/', projectRoute);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

