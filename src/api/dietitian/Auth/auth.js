import {
  post,
} from '../../request-methods';

export const login = (data, res, err) => post(
  '/api/v1/login/submit',
  data,
).then(res).catch(err);


export default {
  name: 'auth',
  login,
};
