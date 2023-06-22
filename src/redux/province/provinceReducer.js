import ProvinceActionTypes from "./province.types";

const INITIAL_STATE = {
  province: '',
};
const provinceReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ProvinceActionTypes.SET_PROVINCE:
      return {
        ...action.payload,
      };

    default:
      return state;
  }
};

export default provinceReducer;
