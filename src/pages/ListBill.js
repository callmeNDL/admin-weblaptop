import { useEffect, useState } from 'react';
// @mui
import {
  Stack,
  Button,
  Container,
  Typography,
  TextField,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';
import { get, getAuthToken } from '../services/request/request-service';
import ActionButtons from '../components/action-button/ActionButtons';
// ----------------------------------------------------------------------


export default function ListBill() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState([]);
    const columns = [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'userName', headerName: 'Tên khách hàng', width: 150 },
      // {
      //   field: 'description',
      //   headerName: 'Chi tiết hóa đơn',
      //   minWidth: 370,
      //   align: 'center',
      //   flex: 1,
      //   renderCell: (params) => (
      //     <div style={{ width: 450, display: 'flex', alignItems: 'center', whiteSpace: 'normal', gap: 10 }}>
      //       <img
      //         src={params.row && params.row?.hinhAnhs[0]?.path}
      //         alt="img-product-cart"
      //         style={{ width: '80px', height: '80px', objectFit: 'cover' }}
      //       />
      //       <div>
      //         <div>{params.row.name}</div>
      //       </div>
      //     </div>
      //   ),
      // },
      { field: 'description', headerName: 'Chi tiết hóa đơn', width: 400 },
      { field: 'closeDate', headerName: 'Thời hạn', width: 110 },
     
      {
        field: 'total',
        headerName: 'Tổng tiền',
        type: 'number',
        minWidth: 90,
        align: 'center',
      },
      {
        field: 'status',
        headerName: 'Trạng thái',
        sortable: false,
        minWidth: 100,
        align: 'center',
      },
      {
        field: 'acb',
        headerName: 'Actions',
        minWidth: 100,
        align: 'center',
        renderCell: (params) =>
          ActionButtons(
            params.row,
            () => { },
            () => { }
          ),
      },
    ];
  
    const rows = []
  
    useEffect(() => {
      getList()
    }, [])
  
    const getList = async () => {
      const { accessToken } = await getAuthToken();
      if (accessToken) {
        try {
          const res = await get('sanpham', {
            headers: {
              Authorization: `Token ${accessToken}`,
            }
          })
          if (res) {
            setDataList(res)
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
  
    const handleClickOpen = () => {
      setOpen(false);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const handleOnChange = (e) => {
      console.log(e.target.files[0]);
      setFile(e.target.files[0]);
    };
  
    return (
      <>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Danh sách hóa đơn
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setOpen(true);
              }}
            >
              Thêm hóa đơn
            </Button>
          </Stack>
          <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                disableRowSelectionOnClick
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                rowHeight={100}
              />
            </div>
          </Stack>
          <FormDialog
            open={open}
            title="Thêm mới hóa đơn"
            ok="Thêm mới"
            close="Đóng"
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
          >
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField id="name" label="Name" multiline rows={2} fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField id="price" label="Giá" fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">RAM</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="RAM">
                      <MenuItem value={10}>Apple</MenuItem>
                      <MenuItem value={20}>MSI</MenuItem>
                      <MenuItem value={30}>DELL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Thương hiệu</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Thương hiệu">
                      <MenuItem value={10}>Apple</MenuItem>
                      <MenuItem value={20}>MSI</MenuItem>
                      <MenuItem value={30}>DELL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">CPU</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="CPU">
                      <MenuItem value={10}>Apple</MenuItem>
                      <MenuItem value={20}>MSI</MenuItem>
                      <MenuItem value={30}>DELL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Thương hiệu</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Thương hiệu">
                      <MenuItem value={10}>Apple</MenuItem>
                      <MenuItem value={20}>MSI</MenuItem>
                      <MenuItem value={30}>DELL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Đồ họa</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Đồ họa">
                      <MenuItem value={10}>Apple</MenuItem>
                      <MenuItem value={20}>MSI</MenuItem>
                      <MenuItem value={30}>DELL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Đồ họa</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Đồ họa">
                      <MenuItem value={10}>Apple</MenuItem>
                      <MenuItem value={20}>MSI</MenuItem>
                      <MenuItem value={30}>DELL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Lưu trữ</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Lưu trữ">
                      <MenuItem value={10}>Apple</MenuItem>
                      <MenuItem value={20}>MSI</MenuItem>
                      <MenuItem value={30}>DELL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={9}>
                  <TextField id="name" label="Hình ảnh" fullWidth disabled value={file ? file?.name : ''} />
                </Grid>
                <Grid item xs={3}>
                  <Button variant="contained" component="label" style={{ height: '100%' }}>
                    Upload File
                    <input type="file" hidden onChange={handleOnChange} />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </FormDialog>
        </Container>
      </>
    );
  }