import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ActionButtons = ({ handleClickOpen, handleClickDelOpen }) => {
  return (
    <div>
      <Tooltip title="Edit" arrow>
        <IconButton onClick={handleClickOpen} size="small" color="primary">
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete" arrow>
        <IconButton onClick={handleClickDelOpen} size="small">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ActionButtons;
