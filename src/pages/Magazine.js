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

export default function Magazine() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState([]);
    const columns = [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'title', headerName: 'Tiêu đề', width: 110 },
      {
        field: 'content',
        headerName: 'Nội dung',
        minWidth: 400,
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
        title: 'MacBook Air 15 inch lên kệ Việt Nam giữa tháng 7',
        content: 'Apple đang thuyết phục người dùng Việt Nam, chuyển sang dùng MacOS.',
      },
      {
        id: 2,
        title: '8 tính năng ảnh mới cho MacOS 17',
        content: 'Nhận dạng thú cưng, cắt ảnh nhanh, cắt chủ thể thành sticker... là những tính năng mới về hình ảnh',
      },
    ]
  
    useEffect(() => {
      getList()
    }, [])
  
    const getList = async () => {
      const { accessToken } = await getAuthToken();
      if (accessToken) {
        try {
          const res = await get('baiviet', {
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
              Tin tức
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setOpen(true);
              }}
            >
              Bài viết mới
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
            title="Thêm mới bài viết"
            ok="Thêm mới"
            close="Đóng"
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
          >
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>                
                <Grid item xs={12}>
                  <TextField id="title" label="Tiêu đề" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField id="content" label="Nội dung" multiline rows={2} fullWidth />
                </Grid>
                
                {/* <Grid item xs={3}>
                  <Button variant="contained" component="label" style={{ height: '100%' }}>
                    Upload File
                    <input type="file" hidden onChange={handleOnChange} />
                  </Button>
                </Grid> */}
              </Grid>
            </Box>
          </FormDialog>
        </Container>
      </>
    );
  }