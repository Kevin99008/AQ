import Cookies from 'js-cookie';

export const setCookie = (name: string, value: string, options: { [key: string]: any } = {}) => {
  Cookies.set(name, value, { path: '/', ...options });
};

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const deleteCookie = (name: string) => {
  Cookies.remove(name, { path: '/' });
};
