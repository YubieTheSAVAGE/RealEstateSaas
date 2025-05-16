const prisma = require("../utils/prisma");


const getAllTasks = async () => {
    return prisma.task.findMany({
        include: {
        comments: true,
        },
        orderBy: {
        createdAt: 'desc',
        },
    });
};

/**
 * Get a task by its ID
 * @param {string} id - Task ID
 * @param {boolean} includeComments - Whether to include comments
 * @returns {Promise<Object>} Task object
 */
const getTaskById = async (id, includeComments = true) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { 
      comments: includeComments 
    },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
};


const createTask = async (data) => {
  const { title, description, dueDate, status } = data;
  
  return prisma.task.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      status: status || 'TODO',
    },
  });
};

/**
 * Update an existing task
 * @param {string} id - Task ID
 * @param {Object} data - Updated task data
 * @returns {Promise<Object>} Updated task
 */
const updateTask = async (id, data) => {
  const { title, description, dueDate, status } = data;
  
  // First check if the task exists
  const existingTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!existingTask) {
    throw new Error('Task not found');
  }

  // Update the task
  return prisma.task.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
      ...(status !== undefined && { status }),
    },
  });
};

/**
 * Delete a task and its associated comments
 * @param {string} id - Task ID
 * @returns {Promise<Object>} Deleted task
 */
const deleteTask = async (id) => {
  // First check if the task exists
  const existingTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!existingTask) {
    throw new Error('Task not found');
  }

  // Delete all comments associated with this task first
  await prisma.comment.deleteMany({
    where: { taskId: id },
  });

  // Then delete the task
  return prisma.task.delete({
    where: { id },
  });
};

/**
 * Add a comment to a task
 * @param {string} taskId - Task ID
 * @param {string} content - Comment content
 * @returns {Promise<Object>} Created comment
 */
const addComment = async (taskId, content) => {
  // First check if the task exists
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    throw new Error('Task not found');
  }

  return prisma.comment.create({
    data: {
      content,
      taskId,
    },
    include: {
      task: true,
    },
  });
};

/**
 * Get all comments for a task
 * @param {string} taskId - Task ID
 * @returns {Promise<Array>} List of comments
 */
const getTaskComments = async (taskId) => {
  // First check if the task exists
  const id = parseInt(taskId, 10);
  const existingTask = await prisma.task.findUnique({
    where: { id: id },
  });

  if (!existingTask) {
    throw new Error('Task not found');
  }

  return prisma.comment.findMany({
    where: { taskId: id },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Delete a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} Deleted comment
 */
const deleteComment = async (commentId) => {
  const existingComment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    throw new Error('Comment not found');
  }

  return prisma.comment.delete({
    where: { id: commentId },
  });
};

/**
 * Update task status
 * @param {string} id - Task ID
 * @param {string} status - New status (TODO, IN_PROGRESS, COMPLETED)
 * @returns {Promise<Object>} Updated task
 */
const updateTaskStatus = async (id, status) => {
  // Validate status
  const validStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Find task
  const existingTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!existingTask) {
    throw new Error('Task not found');
  }

  // Update status
  return prisma.task.update({
    where: { id },
    data: { status },
  });
};

/**
 * Count tasks by status
 * @returns {Promise<Object>} Count of tasks by status
 */
const getTasksCount = async () => {
  const counts = await prisma.task.groupBy({
    by: ['status'],
    _count: {
      id: true
    }
  });

  // Format the response
  const result = {
    TODO: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    total: 0
  };

  counts.forEach(item => {
    result[item.status] = item._count.id;
    result.total += item._count.id;
  });

  return result;
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


