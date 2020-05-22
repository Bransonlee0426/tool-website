import {
  post,
} from '../../request-methods';

export const confirmEmailAPI = (data, res, err) => post(
  '/api/v1/forget/submit',
  data,
).then(res).catch(err);

export const resetCheckin = (res, err, headers) => post(
  '/api/v1/reset/checkin',
  {},
  headers,
).then(res).catch(err);

export const resetPassword = (data, res, err, headers) => post(
  '/api/v1/reset/submit',
  data,
  headers,
).then(res).catch(err);

export default {
  name: 'forgotPassword',
  confirmEmailAPI,
  resetCheckin,
  resetPassword,
};
