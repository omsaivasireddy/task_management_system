import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  updateTask,
  deleteTask,
  createSubtask,
  updateSubtask,
  deleteSubtask,
} from '../services/api';
import { setCurrentTask } from '../features/taskSlice';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Completed'];

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const task = useSelector((state) =>
    state.tasks.tasks.find((t) => t.id === parseInt(id))
  );
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [newSubtask, setNewSubtask] = useState({ title: '' });
  const [openSubtaskDialog, setOpenSubtaskDialog] = useState(false);

  useEffect(() => {
    if (!task) {
      navigate('/');
    } else {
      setEditedTask(task);
    }
  }, [task, navigate]);

  if (!task) return null;

  const handleUpdateTask = async () => {
    // try {
    //   const response = await updateTask(task.id, { task: editedTask });
    //   dispatch(setCurrentTask(response.data));
    //   setEditMode(false);
    // } catch (error) {
    //   console.error('Failed to update task:', error);
    // }
    try {
    const response = await updateTask(task.id, { task: editedTask });
    
    // Ensure subtasks are included
    const updatedTask = {
      ...response.data,
      subtasks: task.subtasks, // Preserve existing subtasks if not returned in response
    };

    dispatch(setCurrentTask(updatedTask));
    setEditMode(false);
  } catch (error) {
    console.error('Failed to update task:', error);
  }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(task.id);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleCreateSubtask = async () => {
    try {
      // Log input data for debugging
      console.log('Creating subtask with data:', newSubtask);
  
      // API call to create the subtask
      const response = await createSubtask(task.id, { subtask: newSubtask });
      console.log('Subtask created response:', response);
  
      // Update the task state with the newly created subtask
      dispatch(
        setCurrentTask({
          ...task,
          subtasks: task.subtasks ? [...task.subtasks, response.data] : [response.data],
        })
      );
  
      // Close the dialog and reset the input field
      setOpenSubtaskDialog(false);
      setNewSubtask({ title: '' });
    } catch (error) {
      console.error('Failed to create subtask:', error);
    }
  };
  

  const handleUpdateSubtask = async (subtaskId, newStatus) => {
    try {
      const response = await updateSubtask(task.id, subtaskId, {
        subtask: { status: newStatus },
      });
      const updatedSubtasks = task.subtasks.map((st) =>
        st.id === subtaskId ? response.data : st
      );
      dispatch(setCurrentTask({ ...task, subtasks: updatedSubtasks }));
    } catch (error) {
      console.error('Failed to update subtask:', error);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubtask(task.id, subtaskId);
      const updatedSubtasks = task.subtasks.filter((st) => st.id !== subtaskId);
      dispatch(setCurrentTask({ ...task, subtasks: updatedSubtasks }));
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        {editMode ? (
          <>
            <TextField
              fullWidth
              label="Title"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            
            <TextField
              select
              fullWidth
              label="Status"
              value={editedTask.status}
              onChange={(e) =>
                setEditedTask({ ...editedTask, status: e.target.value })
              }
              sx={{ mb: 2 }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={handleUpdateTask} sx={{ mr: 1 }}>
              Save
            </Button>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              {task.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {task.description}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Status: {task.status}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setEditMode(true)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleDeleteTask}>
              Delete
            </Button>
          </>
        )}
      </Box>

      <Typography variant="h6" gutterBottom>
        Subtasks
        <IconButton
          color="primary"
          onClick={() => setOpenSubtaskDialog(true)}
          sx={{ ml: 1 }}
        >
          <AddIcon />
        </IconButton>
      </Typography>

      <List>
        {task.subtasks?.map((subtask) => (
          <ListItem key={subtask.id}>
            <ListItemText primary={subtask.title} />
            <ListItemSecondaryAction>
              <TextField
                select
                size="small"
                value={subtask.status}
                onChange={(e) =>
                  handleUpdateSubtask(subtask.id, e.target.value)
                }
                sx={{ mr: 1, minWidth: 120 }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <IconButton
                edge="end"
                onClick={() => handleDeleteSubtask(subtask.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog
        open={openSubtaskDialog}
        onClose={() => setOpenSubtaskDialog(false)}
      >
        <DialogTitle>Create New Subtask</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            label="Title"
            fullWidth
            value={newSubtask.title}
            onChange={(e) =>
              setNewSubtask({ ...newSubtask, title: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubtaskDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateSubtask} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TaskDetails;