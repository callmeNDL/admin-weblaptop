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
  // components
  import ActionButtons from '../components/action-button/ActionButtons';
  
  import Iconify from '../components/iconify';
  import FormDialog from '../components/formDialog/FormDialog';
  import { get, getAuthToken } from '../services/request/request-service';
// ----------------------------------------------------------------------

  export default function Banner() {
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
      { field: 'name', headerName: 'Tên banner', width: 200 },
      {
        field: 'image',
        headerName: 'Hinh ảnh',
        minWidth: 150,
        align: 'center',
        flex: 1,
        renderCell: (params) => (
          <div style={{ width: 550, display: 'flex', alignItems: 'center', whiteSpace: 'normal', gap: 10 }}>
            <img
              src={params.row && params.row?.hinhAnhs[0]?.path}
              alt="img-product-cart"
              style={{ width: '300px', height: '100px', objectFit: 'cover' }}
            />
            
          </div>
        ),
      },
      { field: 'createDate', headerName: 'Ngày đăng', width: 110 },
     
     
      {
        field: 'active',
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
  
    const rows = [
      {
        id: 1,
        name: 'Banner 1',
        hinhAnhs: [
          {
            path: 'https://lh3.googleusercontent.com/qOrBIQw0fujbab_5ucewKpvInlZBpo9wt0QDrryM58ijaKH74xIfvD_haJentCJuYNk9lSxygBaLOUWpL2hjtaZseAlU-Lkp=w1920-rw',
          },
        ],
        createDate: '14-05-2023',
        active: true,        
      },
      {
        id: 2,
        name: 'Banner 2',
        hinhAnhs: [
          {
            path: 'https://lh3.googleusercontent.com/vkMMX2cvl_1ii0c_vw5TGy4ixhRc-l7OlMWnmx4-oxquqHo_A9aET_lWxDmxbh-GMZTr3O5JS4kGNa0Ka7hcctxo2lj0xoUR=w1920-rw',
          },
        ],
        createDate: '26-05-2023',
        active: true,        
      },
      {
        id: 3,
        name: 'Banner 3',
        hinhAnhs: [
          {
            path: 'https://lh3.googleusercontent.com/xeJtVH_tnMI4yiWQlonzDKxct9ZVaDFsV4MBaG7UcXIVGO-SVK54g5zBU-uymbOF-Eob9Dt16tzEfAHLgAQAT_4BORa4JOarNQ=w1920-rw',
          },
        ],
        createDate: '28-05-2023',
        active: true,        
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
              Danh sách Banner
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setOpen(true);
              }}
            >
              Thêm Banner
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
          title="Thêm mới Banner"
          ok="Thêm mới"
          close="Đóng"
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        >
          <Box component="form" noValidate autoComplete="off" style={{ marginTop: '10px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField id="name" 
                // value={credentials.tenDanhMuc} 
                // onChange={handleChange} 
                name='tenDanhMuc' label="Tên danh mục" fullWidth />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField id="name" 
                // value={credentials.moTa} 
                // onChange={handleChange} 
                name='link' label="Đường dẫn" fullWidth />
              </Grid> */}
              {/* <Grid item xs={12}>
                <TextField id="name" 
                // value={credentials.moTa} 
                // onChange={handleChange} 
                name='moTa' label="Mô tả" fullWidth />
              </Grid> */}
              <Grid item xs={3}>
                    <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span" style={{ height: '100%' }}>
                        Upload File
                    </Button>
                    <input
                        accept=".xlsx, .xls"
                        id="raised-button-file"
                        multiple
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleOnChangeUpload}
                    />
                    </label>
                    {selectedFile && (
                    <p>Selected file: {selectedFile.name}</p>
                    )}
                </Grid>
            </Grid>
          </Box>
        </FormDialog>
        </Container>
      </>
    );
  }