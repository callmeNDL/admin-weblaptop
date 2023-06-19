import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import AuthService from '../../../services/auth/auth-service';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };
  const handleClick = async () => {
    console.log(credentials, 'credentials');
    await AuthService.logUser(credentials, dispatch)
      .then((res) => {
        enqueueSnackbar('You have successfully logged in.', { variant: 'success' });
        setCredentials({
          email: '',
          password: '',
        });
        navigate('/dashboard/app');
      })
      .catch((err) => {
        enqueueSnackbar('Authentication error', { variant: 'error' });
      });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="username" label="Username" onChange={handleChange} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={handleChange}
        />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
