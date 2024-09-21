const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// Getting single task
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const findTask = await Task.findById(id);
    res.json(findTask);
  } catch (err) {
    res.status(500).json({ error: "Error During Finding task" });
  }
});

// Create a new task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  try {
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      userId: req.user.userId,
    });
    await newTask.save();
    const Data = await Task.find({ userId: req.user.userId });
    res.status(201).json(Data);
  } catch (err) {
    res.status(500).json({ error: "Error creating task" });
  }
});

// Update a task
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
        priority,
        dueDate,
      },
      { new: true }
    );
    const Data = await Task.find({ userId: req.user.userId });
    res.json(Data);
  } catch (err) {
    res.status(500).json({ error: "Error updating task" });
  }
});

// Delete a task
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    const Data = await Task.find({ userId: req.user.userId });
    res.json({ message: "Task deleted", Data });
  } catch (err) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;
