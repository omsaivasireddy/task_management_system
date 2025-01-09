import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Box,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { fetchTasksStart, fetchTasksSuccess, fetchTasksFailure, addTask } from '../features/taskSlice';
import { getTasks, createTask } from '../services/api';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchTasksStart());
      try {
        const response = await getTasks();
        dispatch(fetchTasksSuccess(response.data));
      } catch (error) {
        dispatch(fetchTasksFailure(error.message));
      }
    };
    fetchData();
  }, [dispatch]);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => {
    setOpen(false);
    setNewTask({ title: '', description: '', due_date: '' });
  };

  const handleCreateTask = async () => {
    try {
      const response = await createTask({ task: newTask });
      dispatch(addTask(response.data));
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Task
        </Button>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <TaskCard task={task} />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Title"
            name="title"
            value={newTask.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={newTask.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Due Date"
            name="due_date"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={newTask.due_date}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;