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


export default function Company() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
      
        const handleOnChangeUpload = (event) => {
          const file = event.target.files[0];
          setSelectedFile(file);
        };
    const columns = [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'tenNhaCungCap', headerName: 'Tên nhà cung câp', width: 180 },      
      { field: 'email', headerName: 'Email', width: 200 },      
      { field: 'address', headerName: 'Địa chỉ', width: 210 },     
      {
        field: 'soDienThoai',
        headerName: 'Số điện thoại',
        type: 'number',
        minWidth: 160,
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
  
    const rows = [
      {
        id: 1,
        tenNhaCungCap: 'Công ty CellPhones',
        email:'CellPhones@gmail.com',
        address: '218-220 Trần Quang Khải, phường Tân Định, quận 1, TPHCM',
        soDienThoai:'1800.2097',       
      },
      {
        id: 2,
        tenNhaCungCap: 'Công ty Viễn Thông A',
        email:'VienThongA@gmail.com',
        address: '414/14, Đoàn Văn Bơ, quận 4, TPHCM',
        soDienThoai:'096 788 81 68',       
      },
      {
        id: 3,
        tenNhaCungCap: 'Công ty GearVN',
        email:'gearVn@gmail.com',
        address: '82 Hoàng Hoa Thám, phường 12, quận Tân Bình, TPHCM',
        soDienThoai:'1800 6975',       
      },
      
    ]
  
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
              Nhà cung cấp
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setOpen(true);
              }}
            >
              Thêm nhà cung cấp
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
            title="Thêm mới nhà cung cấp"
            ok="Thêm mới"
            close="Đóng"
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
          >
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField id="name" label="Tên nhà cung cấp" multiline  fullWidth />
                  {/* rows={2} */}
                </Grid>
                <Grid item xs={12}>
                  <TextField id="email" label="Email" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField id="diaChi" label="Địa chỉ" fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField id="soDienThoai" label="Số điện thoại" fullWidth />
                </Grid>
                
               
              </Grid>
            </Box>
          </FormDialog>
        </Container>
      </>
    );
  }