const taskService = require('../services/task.service');

async function getAllTasks(request, reply) {
  try {
    const tasks = await taskService.getAllTasks();
    return reply.send(tasks);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function getTaskById(request, reply) {
    try {
        const taskId = request.params.id;
        const task = await taskService.getTaskById(taskId);
        return reply.send(task);
    } catch (err) {
        request.log.error(err);
        return reply.code(err.statusCode || 500).send({ error: err.message });
    }
}


const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, status } = req.body;
        
        if (!title || !description) {
            return res.code(400).send({ message: 'Title and description are required' });
        }
        
        const task = await taskService.createTask({
        title,
        description,
        dueDate,
        status,
        });
        
        return res.code(200).send(task);
    } catch (error) {
        return res.code(500).send({ message: error.message });
    }
}


const updateTask = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        const { title, description, dueDate, status } = req.body;
        const task = await taskService.updateTask(id, {
            title,
            description,
            dueDate,
            status,
        });
        if (!task) {
            return res.code(404).send({ message: 'Task not found' });
        }
        return res.send(task);
    } catch (error) {
        if (error.message === 'Task not found') {
            return res.code(404).send({ message: error.message });
        }
        if (error.message.includes('Invalid status')) {
            return res.code(400).send({ message: error.message });
        }
        return res.code(500).send({ message: error.message });
    }
};


const deleteTask = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        await taskService.deleteTask(id);

        res.code(200).send({ message: 'Task deleted successfully' });
    } catch (error) {
        if (error.message === 'Task not found') {
            return res.code(404).send({ message: error.message });
        }
        return res.code(500).send({ message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { comment } = req.body;
    
        if (!comment) {
        return res.code(400).send({ message: 'Comment is required' });
        }
        const id = parseInt(taskId, 10);   
    
        const newComment = await taskService.addComment(id, comment);
        res.code(201).send(newComment);
    } catch (error) {
        if (error.message === 'Task not found') {
        return res.status(404).send({ message: error.message });
        }
        res.code(500).send({ message: error.message });
    }
}

/**
 * Get all comments for a task
 */
const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await taskService.getTaskComments(taskId);
    res.send(comments);
  } catch (error) {
    if (error.message === 'Task not found') {
      return res.status(404).send({ message: error.message });
    }
    res.status(500).send({ message: error.message });
  }
};

/**
 * Delete a comment
 */
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await taskService.deleteComment(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    if (error.message === 'Comment not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};


const updateTaskStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { status } = req.body;

        if (!status) {
            return res.status(400).send({ message: 'Status is required' });
        }

        const task = await taskService.updateTaskStatus(id, status);
        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }
        return res.send(task);
    } catch (error) {
        if (error.message === 'Task not found') {
            return res.status(404).send({ message: error.message });
        }
        if (error.message.includes('Invalid status')) {
            return res.status(400).send({ message: error.message });
        }
        return res.status(500).send({ message: error.message });
    }
}

/**
 * Get task statistics
 */
const getTasksCount = async (req, res) => {
  try {
    const stats = await taskService.getTasksCount();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getTaskComments,
  deleteComment,
  updateTaskStatus,
  getTasksCount
};