// @mui
import { useEffect, useState } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { enqueueSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';

// components
import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';
import ActionButtons from '../components/action-button/ActionButtons';
import { get, getAuthToken, post } from '../services/request/request-service';
import { setProvinceAction } from '../redux/province/province.actions';
import { selectProvince } from '../redux/province/province.selectors';

// ----------------------------------------------------------------------
export default function UsersPageV2() {
  const [open, setOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [credentials, setCredentials] = useState({
    province: '',
    district: '',
    ward: '',
  });
  const [province, setProvince] = useState([]);
  const dispatch = useDispatch();

  const columns = [
    { field: 'id', headerName: 'ID', width: 50, align: 'center' },
    {
      field: 'hoTenLot',
      headerName: 'Họ tên lot',
      minWidth: 100,
      align: 'center',
      flex: 1,
    },
    {
      field: 'ten',
      headerName: 'Tên',
      width: 150,
      align: 'center',
      flex: 1
    },
    {
      field: 'soDienThoai',
      headerName: 'Số điện thoại',
      minWidth: 120,
      flex: 1,
      align: 'center',
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 100,
      flex: 1,
      align: 'center',
    },
    {
      field: 'diaChi',
      headerName: 'Địa chỉ',
      minWidth: 100,
      flex: 1,
      align: 'center',
    },
    {
      field: 'province',
      headerName: 'Thành phố / Tỉnh ',
      minWidth: 100,
      flex: 1,
      align: 'center',
      renderCell: (params) => <div>{params.row.province.name}</div>,
    },
    {
      field: 'acb',
      headerName: 'Actions',
      minWidth: 120,
      flex: 1,
      align: 'center',
      renderCell: (params) =>
        ActionButtons(
          params.row,
          () => { },
          () => { }
        ),
    },
  ];
  // const selectProvince = useSelector((state) => state.province)

  useEffect(() => {
    getList()
    getProvince()
    // if (!selectProvince) { getProvince() }
  }, [])


  const getProvince = async () => {
    try {
      const res = await get('province')
      if (res) {
        setProvince(res);
        // dispatch(setProvinceAction(res))
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadDistrict = async () => {
      try {
        const req = await get(`/district/${credentials.province}`);
        if (req) {
          console.log(req);
          setDistrict(req);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (credentials && credentials.province) {
      loadDistrict();
    }
    return () => { };
  }, [credentials.province]);

  useEffect(() => {
    const loadWard = async () => {
      try {
        const req = await get(`/ward/${credentials.district}`);
        if (req) {
          setWard(req);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (credentials && credentials.district) {
      loadWard();
    }
    return () => { };
  }, [credentials.district]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const changeDate = (view) => {
    const date = view.$d.toLocaleDateString('en-CA');
    setCredentials({
      ...credentials,
      'ngaySinh': date,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(credentials, 'credentials');
    try {
      const res = await post('/customer/register', credentials);
      if (res) {
        enqueueSnackbar('Thêm thành công', { variant: 'success' });
        setCredentials({})
        handleClose()
      }
    } catch (error) {
      enqueueSnackbar('Thêm thất bại', { variant: 'error' });
    }
  };

  const getList = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('customer', {
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
    setCredentials({
      province: '',
      district: '',
      ward: '',
    })
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Người dùng
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
              checkboxSelection
              rowHeight={100}
            />
          </div>
        </Stack>
      </Container>
      <FormDialog
        open={open}
        ok="Thêm mới"
        close="Đóng"
        title="Thêm mới sản người dùng"
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="hoTenLot"
                required
                fullWidth
                id="hoTenLot"
                type="text"
                label="Họ và tên lót"
                onChange={handleChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="ten"
                label="Ten"
                type="text"
                name="ten"
                autoComplete="family-name"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="username"
                label="Username"
                id="username"
                type="text"
                autoComplete="new-username"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Ngày sinh"
                onChange={(view) => {
                  changeDate(view);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="soDienThoai"
                label="SDT"
                type="number"
                id="soDienThoai"
                autoComplete="new-password"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Thành phố / Tỉnh</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={credentials && credentials.province ? credentials.province : ''}
                  label="province"
                  name="province"
                  onChange={handleChange}
                >
                  {province && province.map(({ id, name, code }) => {
                    return (
                      <MenuItem value={id} key={id}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Quận / Huyện</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={credentials && credentials.district ? credentials.district : ''}
                  label="district"
                  name="district"
                  onChange={handleChange}
                >
                  {district &&
                    district.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Phường</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={credentials && credentials.ward ? credentials.ward : ''}
                  label="ward"
                  name="ward"
                  onChange={handleChange}
                >
                  {ward.map(({ id, name, code }) => {
                    return (
                      <MenuItem value={id} key={id}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="diaChi"
                required
                fullWidth
                id="diaChi"
                type="text"
                label="Địa chỉ"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </FormDialog>
    </>
  );
}
