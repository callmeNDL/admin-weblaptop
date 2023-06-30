import { Search } from '@mui/icons-material';
import { Button, Grid, TextField } from '@mui/material';
import React from 'react';
import Iconify from '../iconify/Iconify';

const SearchTable = ({ children }) => {
  return (
    <Grid container style={{ margin: '20px 0px' }}>
      {children}
      <Button variant="outlined" startIcon={<Search />} onClick={() => {}} style={{ marginLeft: '20px' }}>
        Tìm kiếm
      </Button>
    </Grid>
  );
};

export default SearchTable;
