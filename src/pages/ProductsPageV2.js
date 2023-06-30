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
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
// components
import ActionButtons from '../components/action-button/ActionButtons';
import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';
import { Delete, get, getAuthToken, post } from '../services/request/request-service';
import SearchTable from '../components/search/SeachTable';
import { enumData } from '../constant/enumData';
import FormDialogSubmit from '../components/formDialog/FormDialogSubmit';
// ----------------------------------------------------------------------
export default function ProductPageV2() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [nhasanxuats, setnhasanxuats] = useState([]);
  const [danhMucs, setdanhMucs] = useState([]);
  const [selectData, setSelectData] = useState({});
  const [openDelete, setOpenDelete] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'tenSanPham', headerName: 'Tên sản phẩm', width: 340 },
    {
      field: 'hinhAnhs',
      headerName: 'Hinh ảnh',
      minWidth: 150,
      align: 'center',
      flex: 1,
      renderCell: (params) => (
        <div style={{ width: 450, display: 'flex', alignItems: 'center', whiteSpace: 'normal', gap: 10 }}>
          <img
            src={params.row && params.row?.hinhAnhs[0]?.path}
            alt="img-product-cart"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          {/* <div>
            <div>{params.row.name}</div>
          </div> */}
        </div>
      ),
    },
    { field: 'brand', headerName: 'Thương hiệu', width: 110 },
    {
      field: 'gia',
      headerName: 'Giá',
      type: 'number',
      minWidth: 90,
      align: 'center',
    },
    {
      field: 'soLuongTon',
      headerName: 'Số lượng tồn',
      sortable: false,
      minWidth: 100,
      align: 'center',
    },
    {
      field: 'trangThai',
      headerName: 'Trạng thái',
      type: 'number',
      minWidth: 160,
      renderCell: (params) => (
        <div className={`tag tag-${params.row.trangThai ? 'active' : 'block'}`}>
          {params.row.trangThai ? 'Hoạt động' : 'Khóa'}
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
  const {
    register,
    reset,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      tenSanPham: '',
      gia: '',
      moTa: '',
      namRaMat: '',
      soLuongTon: 0,
      baoHanh: '',
      danhMuc: '',
      nhaSanXuat: '',
      thuocTinhs: [],
    },
  });

  const getNhasanxuats = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('nhasanxuat', {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res?.status === 'OK') {
          setnhasanxuats(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getdanhMucs = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('loaisanpham', {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res?.status === 'OK') {
          setdanhMucs(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getList = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('sanphamactive?limit=10&currentpage=0', {
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

  const handleClickOpen = () => {
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectData({});
  };
  const handleOnChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    const fromData = {
      tenSanPham: data.tenSanPham,
      namRaMat: data.namRaMat ?? '',
      soLuongTon: data.soLuongTon ?? 0,
      baoHanh: data.baoHanh ?? '',
      danhMuc: {
        id: data.danhMuc,
      },
      nhaSanXuat: {
        id: data.nhaSanXuat,
      },
      thuocTinhs: [
        { tenThuocTinh: 'CPU', giaTriThuocTinh: data.CPU },
        { tenThuocTinh: 'Ram', giaTriThuocTinh: data.RAM },
        { tenThuocTinh: 'Màn hình', giaTriThuocTinh: data.Manhinh },
        { tenThuocTinh: 'Lưu trữ', giaTriThuocTinh: data.Luutru },
        { tenThuocTinh: 'Màu sắc', giaTriThuocTinh: data.Mau },
        { tenThuocTinh: 'Giá', giaTriThuocTinh: data.gia },
      ],
    };

    // truong hop nay la không có seledata nghĩa là mình chưa chọn thằng nào nên n hiểu là taọ mơis
    try {
      console.log(fromData, 'check from daat');
      if (fromData) {
        const { accessToken } = await getAuthToken();
        if (accessToken) {
          const res = await post('sanpham', fromData, {
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
  };

  const handleDelete = async () => {
    try {
      const { accessToken } = await getAuthToken();
      if (accessToken && selectData) {
        // call api delete
        const res = await Delete(`sanpham/${selectData.id}`, {
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
    setSelectData('')
    setSelectData({});
  };

  useEffect(() => {
    getList();
    getNhasanxuats();
    getdanhMucs();
    setSelectData({});
  }, []);

  useEffect(() => {
    if (selectData) {
      console.log("ASASDA");
      reset((value) => ({
        ...value,
        ...selectData,
        CPU: 'Intel Core i3-1115G4',
        RAM: value.thuocTinhs?.find((item) => item.tenThuocTinh === 'Ram')?.giaTriThuocTinh ?? '',
        Manhinh: value.thuocTinhs?.find((item) => item.tenThuocTinh === 'Màn hình')?.giaTriThuocTinh ?? '',
        Luutru: value.thuocTinhs?.find((item) => item.tenThuocTinh === 'Lưu trữ')?.giaTriThuocTinh ?? '',
        Mau: value.thuocTinhs?.find((item) => item.tenThuocTinh === 'Màu sắc')?.giaTriThuocTinh ?? '',
        gia: value.thuocTinhs?.find((item) => item.tenThuocTinh === 'Giá')?.giaTriThuocTinh ?? '',
      }));

      setValue('CPU', 'Intel Core i3-1115G4');
    }
    console.log(selectData, 'selectData');
  }, [selectData]);

  console.log(selectData, 'data');

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Sản phẩm
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setOpen(true);
            }}
          >
            Thêm mới
          </Button>
        </Stack>
        <SearchTable>
          <TextField name="tenSanPham" label="Tên sản phẩm" />
        </SearchTable>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={dataList ?? []}
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
        <FormDialogSubmit open={open} title="Thêm mới sản phẩm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="tenSanPham"
                  {...register('tenSanPham', { required: 'Nhập tên sản phẩm' })}
                  label="Tên sản phẩm"
                  fullWidth
                  error={!!errors.tenSanPham}
                  helperText={errors.tenSanPham?.message}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="baoHanh"
                  {...register('baoHanh', { required: 'Nhập thời gian bảo hành' })}
                  label="Thời gian bảo hành"
                  fullWidth
                  error={!!errors.baoHanh}
                  helperText={errors.baoHanh?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="soLuongTon"
                  {...register('soLuongTon', { required: 'Nhập số lượng tồn' })}
                  label="Số lượng tồn"
                  fullWidth
                  error={!!errors.soLuongTon}
                  helperText={errors.soLuongTon?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="namRaMat"
                  {...register('namRaMat', { required: 'Nhập Năm ra mắt' })}
                  label="Năm ra mắt"
                  fullWidth
                  error={!!errors.namRaMat}
                  helperText={errors.namRaMat?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  name="nhaSanXuat"
                  label="Nhà sản xuất"
                  inputProps={register('nhaSanXuat', {
                    required: 'Nhap nhà sản xuất!',
                  })}
                  error={errors.nhaSanXuat}
                  helperText={errors.nhaSanXuat?.message}
                >
                  {nhasanxuats.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.tenNhaSanXuat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  name="danhMuc"
                  label="Danh mục"
                  inputProps={register('danhMuc', {
                    required: 'Nhập danh mục!',
                  })}
                  error={errors.danhMuc}
                  helperText={errors.danhMuc?.message}
                >
                  {danhMucs.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.tenDanhMuc}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  name="RAM"
                  label="RAM"
                  inputProps={register('RAM', {
                    required: 'Nhap RAM!',
                  })}
                  error={errors.RAM}
                  helperText={errors.RAM?.message}
                >
                  {enumData.RAM.map((option) => (
                    <MenuItem key={option.value} value={option.giaTriThuocTinh}>
                      {option.giaTriThuocTinh}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  name="CPU"
                  label="CPU"
                  inputProps={register('CPU', {
                    required: 'Nhap CPU!',
                  })}
                  error={errors.CPU}
                  helperText={errors.CPU?.message}
                >
                  {enumData.CPU.map((option) => (
                    <MenuItem key={option.value} value={option.giaTriThuocTinh}>
                      {option.giaTriThuocTinh}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  name="Luutru"
                  label="Lưu trữ"
                  inputProps={register('Luutru', {
                    required: 'Nhập lưu trữ!',
                  })}
                  error={errors.Luutru}
                  helperText={errors.Luutru?.message}
                >
                  {enumData.Luutru.map((option) => (
                    <MenuItem key={option.value} value={option.giaTriThuocTinh}>
                      {option.giaTriThuocTinh}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  name="Manhinh"
                  label="Màn hình"
                  inputProps={register('Manhinh', {
                    required: 'Nhap màn hình!',
                  })}
                  error={errors.Manhinh}
                  helperText={errors.Manhinh?.message}
                >
                  {enumData.Manhinh.map((option) => (
                    <MenuItem key={option.value} value={option.giaTriThuocTinh}>
                      {option.giaTriThuocTinh}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  name="Mau"
                  label="Màu"
                  inputProps={register('Mau', {
                    required: 'Nhap Mau!',
                  })}
                  error={errors.Mau}
                  helperText={errors.Mau?.message}
                >
                  {enumData.Mau.map((option) => (
                    <MenuItem key={option.value} value={option.giaTriThuocTinh}>
                      {option.giaTriThuocTinh}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="gia"
                  {...register('gia', { required: 'Nhập giá' })}
                  label="Giá"
                  type="number"
                  fullWidth
                  error={!!errors.gia}
                  helperText={errors.gia?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField name="moTa" {...register('moTa')} label="Mô tả" type="text" fullWidth />
              </Grid>
              {/* <Grid item xs={9}>
                <TextField id="name" label="Hình ảnh" fullWidth disabled value={file ? file?.name : ''} />
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" component="label" style={{ height: '100%' }}>
                  Upload File
                  <input type="file" hidden onChange={handleOnChange} />
                </Button>
              </Grid> */}
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
  );
}
