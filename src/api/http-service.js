/* eslint-disable no-console */
import axios from 'axios';
import Vue from 'vue';
import store from '../store';
import router from '../router/index';

export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: 'http://54.64.77.99:8090', // server
      // baseURL: 'http://192.168.10.231:8090', //local
      timeout: 30000,
      headers: {},
    });
    const loader = Vue.$loading.show();
    // request 攔截器 loading動畫 set token
    instance.interceptors.request.use(
      (config) => {
        const token = JSON.parse(window.localStorage.getItem('token'));
        if (token) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = token;
        }
        return config;
      },
      error => Promise.error(error),
    );

    // response 攔截器 自動轉址 關閉loading動畫 save token
    instance.interceptors.response.use(
      (response) => {
        if (response.headers.authorization !== undefined) {
          const token = JSON.stringify(response.headers.authorization);
          window.localStorage.setItem('token', token);
        }
        loader.hide();
        if (response.status === 200) {
          return Promise.resolve(response.data);
        }
        return Promise.reject(response);
      },
      (error) => {
        loader.hide();
        if (error.response.status) {
          switch (error.response.status) {
            case 401:
              store.dispatch('userInfo/logout');
              router.replace({
                path: '/',
              });
              break;
            default:
              break;
          }
        }
        return Promise.reject(error.response);
      },
    );
    instance(options)
      .then((res) => {
        resolve(res);
        return false;
      })
      .catch((error) => {
        reject(error);
      });
  });
}
