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
  Input,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { Tag } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';
import { Delete, get, getAuthToken, post, put } from '../services/request/request-service';
import ActionButtons from '../components/action-button/ActionButtons';
import FormDialogSubmit from '../components/formDialog/FormDialogSubmit';
import { enumData } from '../constant/enumData';
import SearchTable from '../components/search/SeachTable';

// ----------------------------------------------------------------------

export default function Company() {
  const [open, setOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectData, setSelectData] = useState({});

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      tieuDe: '',
      noiDung: '', 
      createDate:'',  
      active:'',   
    },
  });
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'tieuDe', headerName: 'Tiêu đề', width: 180 },
    { field: 'noiDung', headerName: 'Nội dung', width: 200 },
    // { field: 'createDate', headerName: 'Ngày tạo', width: 200 },
    {
      field: 'createDate',
      headerName: 'Ngày tạo',
      width: 200,
      renderCell: (params) => (
        <div>{new Date(params.row.createDate).toLocaleDateString('en-GB')}</div>
      ),
    },
    {
      field: 'active',
      headerName: 'Trạng thái',
      type: 'number',
      minWidth: 160,
      renderCell: (params) => (
        <div className={`tag tag-${params.row.active ? 'active' : 'block'}`}>
          {params.row.active ? 'Hoạt động' : 'Khóa'}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 100,
      align: 'center',
      renderCell: (params) => (
        <ActionButtons
          handleClickOpen={() => {
            // set gia tri muon update (daang chon)
            setSelectData(params.row);
            reset(params.row);
            setOpen(true);
          }}
          handleClickDelOpen={() => {
            setSelectData(params.row);
            setOpenDelete(true);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('baiviet', {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res?.status === 'OK') {
          setDataList(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectData('');
    reset({
      tieuDe: '',
      noiDung: '', 
      createDate:'',
      active:'',
    });
  };

  const onSubmit = async (data) => {
    console.log(selectData, 'selectData');
    if (!selectData && !selectData?.id) {
      // truong hop nay la không có seledata nghĩa là mình chưa chọn thằng nào nên n hiểu là taọ mơis
      try {
        if (data) {
          const { accessToken } = await getAuthToken();
          if (accessToken) {
            const res = await post('baiviet', data, {
              headers: {
                Authorization: `Token ${accessToken}`,
              },
            });
            if (res?.status === 'OK') {
              getList();
              enqueueSnackbar('Thêm thành công', { variant: 'success' });
              handleClose();
            } else {
              enqueueSnackbar('Thêm thất bại', { variant: 'error' });
            }
          }
        }
      } catch (error) {
        enqueueSnackbar('Thêm thất bại', { variant: 'error' });
        console.log(error);
      }
    } else {
      console.log('AaaAA');

      // ngược lại nếu đẫ chọn 1 thằng rồi thì la cap nhật
      try {
        if (data) {
          const { accessToken } = await getAuthToken();
          if (accessToken) {
            const res = await put(`baiviet/${selectData.id}`, data, {
              headers: {
                Authorization: `Token ${accessToken}`,
              },
            });
            if (res?.status === 'OK') {
              getList();
              enqueueSnackbar(res?.message, { variant: 'success' });
              handleClose();
            } else {
              enqueueSnackbar('Cập nhật thất bại', { variant: 'error' });
            }
          }
        }
      } catch (error) {
        enqueueSnackbar('Cập nhật thất bại', { variant: 'error' });
        console.log(error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const { accessToken } = await getAuthToken();
      if (accessToken && selectData) {
        // api delete
        const res = await Delete(`baiviet/${selectData.id}`, {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res?.status === 'OK') {
          getList();
          enqueueSnackbar(res?.message, { variant: 'success' });
          handleDeleteClose();
        } else {
          enqueueSnackbar('Khóa thất bại', { variant: 'error' });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
    setSelectData('');
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Bài viết
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setOpen(true);
            }}
          >
            Thêm bài viết
          </Button>
        </Stack>
        <SearchTable>
          <TextField name="tieuDe" label="Tìm tiêu đề" />
        </SearchTable>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={dataList}
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
        <FormDialogSubmit open={open} title={`${selectData?.id ? 'Cập nhật' : 'Thêm mới'} bài viết`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="tieuDe"
                  {...register('tieuDe', { required: 'Nhập tiêu đề' })}
                  label="Tiêu đề"
                  fullWidth
                  error={!!errors.tieuDe}
                  helperText={errors.tieuDe?.message}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  name="email"
                  {...register('email', { required: 'Nhập Email' })}
                  label="Email"
                  fullWidth
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  name="noiDung"
                  {...register('noiDung', { required: 'Nhập nôi dung' })}
                  label="Nội dung"
                  fullWidth
                  type="text"
                  error={!!errors.noiDung}
                  helperText={errors.noiDung?.message}
                />
              </Grid>
              <Grid item xs={12}>
                  <TextField
                    name="createDate"
                    {...register('createDate', { required: 'Nhập ngày tạo' })}
                    label="Ngày tạo"
                    fullWidth
                    type="date"
                    error={!!errors.createDate}
                    helperText={errors.createDate?.message}
                  />
              </Grid>
              
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
              <Button onClick={handleClose}>Đóng</Button>
              <Button type="submit">Hoàn tất</Button>
            </div>
          </form>
        </FormDialogSubmit>
        <FormDialog
          open={openDelete}
          title="Bạn có chắc chắn muốn khóa không ?"
          ok="Khóa"
          close="Đóng"
          handleClickOpen={() => {}}
          handleClose={handleDeleteClose}
          handleSubmit={handleDelete}
        >
          <Box component="form" noValidate autoComplete="off" style={{ marginTop: '10px' }}>
            <></>
          </Box>
        </FormDialog>
      </Container>
    </>
  ); // thiếu form thêm, xóa cần được hiện ra
}
