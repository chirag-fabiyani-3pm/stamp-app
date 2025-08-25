import Cookies from 'js-cookie';

export function isUserLoggedIn(): boolean {
  const jwt = Cookies.get('stamp_jwt');
  const userData = typeof window !== 'undefined' ? localStorage.getItem('stamp_user_data') : null;
  return !!jwt && !!userData;
} 