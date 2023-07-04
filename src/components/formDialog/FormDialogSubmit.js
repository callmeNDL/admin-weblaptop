import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialogSubmit({
  children,
  open,
  title,
  handleClickOpen,
  handleSubmit,
  handleClose,
  ok,
  close,
  size = 'sm',
}) {
  return (
    <Dialog
      maxWidth={size}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" >{title}</DialogTitle>
      <DialogContent sx={{ paddingTop: '20px' }}>{children}</DialogContent>
    </Dialog>
  );
}
