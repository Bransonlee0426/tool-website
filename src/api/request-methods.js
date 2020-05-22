import axios from './http-service';

export function get(url, params) {
  return axios({
    url,
    params,
    method: 'get',
  });
}

export function post(url, data, headers = {}) {
  return axios({
    url,
    data,
    headers,
    method: 'post',
  });
}

export function patch(url, data) {
  return axios({
    url,
    data,
    method: 'patch',
  });
}

export function del(url) {
  return axios({
    url,
    method: 'delete',
  });
}

export default {
  get,
  post,
  patch,
  del,
};
