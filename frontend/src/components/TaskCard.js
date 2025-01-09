import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Box,
} from '@mui/material';

const getStatusColor = (status) => {
  switch (status) {
    case 'To Do':
      return 'error';
    case 'In Progress':
      return 'warning';
    case 'Completed':
      return 'success';
    default:
      return 'default';
  }
};

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const completedSubtasks = task.subtasks?.filter(
    (subtask) => subtask.status === 'Completed'
  ).length;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const isCompleted = task.status === 'Completed' || (totalSubtasks > 0 && completedSubtasks === totalSubtasks);

  return (
    <Card
      sx={{
        cursor: 'pointer',
        height: '100%',
        opacity: isCompleted ? 0.7 : 1,
        transition: 'all 0.3s ease',
        backgroundColor: isCompleted ? '#f5f5f5' : 'white',
        '&:hover': {
          opacity: 1,
          transform: 'scale(1.02)',
          boxShadow: isCompleted ? 3 : 6,
        },
      }}
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            textDecoration: isCompleted ? 'line-through' : 'none',
            color: isCompleted ? 'text.secondary' : 'text.primary',
          }}
        >
          {task.title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
            opacity: isCompleted ? 0.7 : 1,
          }}
        >
          {task.description}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={isCompleted ? 'Completed' : task.status}
            color={getStatusColor(task.status)}
            size="small"
            sx={{
              '& .MuiChip-label': {
                textDecoration: 'none', // Ensure no strikethrough for the Chip
              },
            }}
          />
        </Box>
        {totalSubtasks > 0 && (
          <>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ 
                mb: 1,
                backgroundColor: isCompleted ? '#e0e0e0' : undefined,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: isCompleted ? '#66bb6a' : undefined,
                },
              }}
            />
            <Typography 
              variant="caption" 
              color="textSecondary"
              sx={{
                fontWeight: isCompleted ? 'bold' : 'normal',
              }}
            >
              {completedSubtasks} of {totalSubtasks} subtasks completed
              {isCompleted && ' ✓'}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
