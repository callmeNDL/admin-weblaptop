import ProvinceActionTypes from './province.types';

export const setProvinceAction = (loginData) => {
  return {
    type: ProvinceActionTypes.SET_PROVINCE,
    payload: loginData,
  };
};

