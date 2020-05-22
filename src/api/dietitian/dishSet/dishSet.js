import {
  post,
  get,
  patch,
  del,
} from '../../request-methods';

export const CreateDishSet = (data, res, err) => post(
  '/api/v1/set',
  data,
).then(res).catch(err);

export const AllRecommendSet = (res, err) => get(
  '/api/v1/set/all',
).then(res).catch(err);

export const getOneDish = (restID, res, err) => get(
  `/api/v1/set/${restID}`,
).then(res).catch(err);

export const updateDish = (recommendSetId, data, res, err) => patch(
  `/api/v1/set/${recommendSetId}`,
  data,
).then(res).catch(err);

export const deleteDish = (recommendSetId, res, err) => del(
  `/api/v1/set/${recommendSetId}`,
).then(res).catch(err);

export default {
  name: 'dishSet',
  CreateDishSet,
  AllRecommendSet,
  getOneDish,
  updateDish,
  deleteDish,
};
