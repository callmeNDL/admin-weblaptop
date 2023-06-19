import jwtDecode from 'jwt-decode';
import { setCurrentUserAction } from '../../redux/user/user.actions';
import request from '../request/request-service';

class AuthService {
  static async logUser(credentials, dispatch) {
    if (credentials?.username && credentials?.password && dispatch) {
      // eslint-disable-next-line import/no-named-as-default-member
      const response = await request.post('/customer/login', credentials);
      if (response?.hasError) {
        throw response;
      }
      return AuthService.handleLogInResponse(response, credentials, dispatch);
    }

    throw new Error('Authentication error');
  }

  static async handleLogInResponse(response, credentials, dispatch) {
    if (response) {
      const decoded = jwtDecode(response.data);
      if ((decoded && decoded.user?.userId, decoded.user?.username)) {
        const afterLoginPage = AuthService.getAfterLoginPage();
        AuthService.setUser(response, decoded, dispatch);
        return afterLoginPage;
      }
    }

    throw new Error('Authentication error');
  }

  static setUser(response, decoded, dispatch) {
    localStorage.setItem('accessToken', response.data);
    dispatch(
      setCurrentUserAction({
        username: decoded.user.username,
        userId: decoded.user.userId,
      })
    );
  }

  static getAfterLoginPage() {
    return 'Login success';
  }
}
export default AuthService;
