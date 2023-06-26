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
    const columns = [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'name', headerName: 'Tên', width: 150 },
      // {
      //   field: 'description',
      //   headerName: 'Mô tả',
      //   minWidth: 360,
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
      { field: 'description', headerName: 'Mô tả', width: 400 },
      { field: 'percentDiscoun', headerName: 'Số lượng', width: 100 },
      { field: 'closeDate', headerName: 'Thời hạn', width: 110 },
      
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
        id:1,
        name: 'Balo laptop Targus',
        description:'Balo laptop Targus 15.6 TSB883 Black (Safire) (Quà tặng)',
        percentDiscoun: 15,
        closeDate: '18-07-2023',
      },
      {
        id:2,
        name: 'Balo laptop TargusLoa Active FiiO SP3',
        description:'Loa Active FiiO SP3 được trang bị dải đèn LED có thể nhấp nháy theo nhạc(Quà tặng)',
        percentDiscoun: 10,
        closeDate: '18-08-2023',
      },
      {
        id:3,
        name: 'Tai nghe kiểm âm Beyerdynamic DT770 Pro',
        description:'Beyerdynamic DT 770 Pro dành cho DJ chỉnh nhạc, không tạp âm(Quà tặng)',
        percentDiscoun: 1,
        closeDate: '20-08-2023',
      },
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
  
    return (
      <>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Khuyến mãi
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setOpen(true);
              }}
            >
              Khuyến mãi mới
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
          title="Thêm mới khuyến mãi"
          ok="Thêm mới"
          close="Đóng"
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        >
          <Box component="form" noValidate autoComplete="off" style={{ marginTop: '10px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField id="name"  label="Tên danh mục khuyến mãi" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField id="name"  label="Mô tả" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
              <DatePicker
                label="Thời hạn"
                onChange={(view) => {
                  ;
                }}
              />
            </Grid>
            </Grid>
          </Box>
        </FormDialog>
        </Container>
      </>
    );
  }

  