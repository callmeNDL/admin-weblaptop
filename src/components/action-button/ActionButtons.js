import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ActionButtons = (params, handleClickOpen, handleClickDelOpen) => {
  const { active } = params;
  return (
    <div>
      <Tooltip title="Edit" arrow>
        <IconButton onClick={handleClickOpen('Edit', params)} size="small" color="primary">
          <EditIcon />
        </IconButton>
      </Tooltip>
      {active ? (
        <Tooltip title="Delete" arrow>
          <IconButton onClick={handleClickDelOpen(params)} size="small">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </div>
  );
};

export default ActionButtons;
