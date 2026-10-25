const express = require('express');
const { readFile } = require('fs');
const router = express.Router();

const fs = require("fs/promises");
const path = require("path");

const basicAuth = require('../middleware/auth');

const tasksFilePath = path.join(__dirname, "../data/tasks.json");

async function readTasks() {
    try {
        const data = await fs.readFile(tasksFilePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            const initialTasks = [
                {
                    id: 1,
                    name: "Example",
                    completed: false
                }
            ];

            await fs.writeFile(
                tasksFilePath,
                JSON.stringify(initialTasks, null, 2),
                "utf8"
            );

            return initialTasks;
        }

        throw error;
    }
}

router.use(express.json({ limit: '10kb' }));

router.use(basicAuth); // Protects all /tasks routes

//GET methods

router.get("/", async (req, res) => {
    try {
        const taskFile = await readTasks();
        res.json(taskFile);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error reading tasks"
        });
    }

});

router.get("/:id", async (req, res) => {
    try {
        const taskFile = await readTasks();
        const taskId = Number(req.params.id);

        const task = taskFile.find(t => t.id === taskId);

        if(!task){
            return res.sendStatus(404)
        } 
             
        res.status(200).json(task)
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error reading task"
        });
    }
    
});

//POST method

router.post("/", async (req,res) =>{
    try {
        const tasksFile = await readTasks();

        const newTask = {
            id: tasksFile.length + 1,
            ...req.body
        };

        tasksFile.push(newTask);

        await fs.writeFile(
            tasksFilePath,
            JSON.stringify(tasksFile, null, 2),
            "utf8"
        );

        res.status(201).json(newTask);

    } catch (err) {
        console.error("Error saving task:", err);
        res.status(500).json({
            error: "Couldn't save task"
        });
    }

})

//UPDATE method
router.put("/:id", async (req,res) => {
    try {
        const taskFile = await readTasks();
        const taskId = Number(req.params.id);
        const taskIndex = taskFile.findIndex(task => task.id === taskId);

        if (taskIndex === -1) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        const updatedTask = {
            ...taskFile[taskIndex],
            id: taskId,
            ...req.body
            
        };

        taskFile[taskIndex] = updatedTask;

        await fs.writeFile(
            tasksFilePath,
            JSON.stringify(taskFile, null, 2),
            "utf8"
        );

        res.status(200).json(updatedTask);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error updating tasks"
        });
    }
});

//DELETE method
router.delete("/:id", async (req, res) => {
    try {
        const taskFile = await readTasks();
        const taskId = Number(req.params.id);

        const taskIndex = taskFile.findIndex(
            task => task.id === taskId
        );

        if (taskIndex === -1) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        const deletedTask = taskFile.splice(taskIndex, 1);

        await fs.writeFile(
            tasksFilePath,
            JSON.stringify(taskFile, null, 2),
            "utf8"
        );

        res.status(200).json(deletedTask[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error deleting task"
        });
    }
});



module.exports = router;

