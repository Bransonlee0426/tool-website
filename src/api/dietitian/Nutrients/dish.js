import {
  post,
  get,
  patch,
  del,
} from '../../request-methods';

export const AllNutData = (res, err) => get(
  '/api/v1/nutrients/all',
).then(res).catch(err);

export const getDishNutirents = (id, res, err) => get(
  `/api/v1/nutrients/${id}`,
).then(res).catch(err);

export const upload = (data, res, err) => post(
  '/api/v1/nutrients/upload',
  data,
).then(res).catch(err);

export const createDishNutrients = (data, res, err) => post(
  '/api/v1/nutrients',
  data,
).then(res).catch(err);

export const editDish = (id, data, res, err) => patch(
  `/api/v1/nutrients/${id}`,
  data,
).then(res).catch(err);

export const deleteDishNutrient = (id, res, err) => del(
  `/api/v1/nutrients/${id}`,
).then(res).catch(err);

export const GetDishNutrientsByRestaurant = (restID, res, err) => get(
  `/api/v1/nutrients/restaurant/${restID}`,
).then(res).catch(err);

export default {
  name: 'dish',
  AllNutData,
  editDish,
  upload,
  GetDishNutrientsByRestaurant,
  getDishNutirents,
  createDishNutrients,
  deleteDishNutrient,
};
