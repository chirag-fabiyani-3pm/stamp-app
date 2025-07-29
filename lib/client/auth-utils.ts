import Cookies from 'js-cookie';

export function isUserLoggedIn(): boolean {
  const jwt = Cookies.get('stamp_jwt');
  const userData = localStorage.getItem('stamp_user_data');
  return !!jwt && !!userData;
} 