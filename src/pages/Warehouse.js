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
  import { DatePicker } from '@mui/x-date-pickers';
   // components
   import ActionButtons from '../components/action-button/ActionButtons';
  
   import Iconify from '../components/iconify';
   import FormDialog from '../components/formDialog/FormDialog';
   import { get, getAuthToken } from '../services/request/request-service';

   // ----------------------------------------------------------------------

   export default function Promo() {
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
      { field: 'tenNhaCungCap', headerName: 'Tên nhà cung cấp', width: 150 },
      
      { field: 'file', headerName: 'Tên tệp', width: 150 },
      // { field: 'status', headerName: 'Trạng thái', width: 110 },
      { field: 'createDate', headerName: 'Ngày nhập', width: 110 },
      
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
        file: 'Cellphones.xlsx',
        createDate: '10-04-2023',
      },
      {
        id: 2,
        tenNhaCungCap: 'Công ty Viễn Thông A',
        file: 'VienThongA.xlsx',
        createDate: '28-05-2023',
      },
      {
        id: 3,
        tenNhaCungCap: 'Công ty GearVN',
        file: 'GearVn.xlsx',
        createDate: '25-06-2023',
      }
    ]
  
    useEffect(() => {
      getList()
    }, [])
  
    const getList = async () => {
      const { accessToken } = await getAuthToken();
      if (accessToken) {
        try {
          const res = await get('khuyenmai', {
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
    // function UploadFileExample() {
    //     const [selectedFile, setSelectedFile] = useState(null);
      
    //     const handleOnChangeUpload = (event) => {
    //       const file = event.target.files[0];
    //       setSelectedFile(file);
    //     };};
      
  
    return (
      <>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Phiếu nhập kho
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setOpen(true);
              }}
            >
              Phiếu nhập kho mới
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
                rowHeight={100}
              />
            </div>
          </Stack>
          <FormDialog
          open={open}
          title="Thêm mới phiếu nhập kho"
          ok="Thêm mới"
          close="Đóng"
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        >
          <Box component="form" noValidate autoComplete="off" style={{ marginTop: '10px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField id="name"  label="Tên nhà cung cấp của phiếu" fullWidth />
              </Grid>   
              <Grid item xs={12} sm={6}>
                <DatePicker
                    label="Ngày tạo"
                    onChange={(view) => {
                    ;
                    }}
                />
                </Grid>           
                <Grid item xs={3}>
                    <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span" style={{ height: '100%' }}>
                        Upload File nhập.
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
