import { createSelector } from 'reselect';

const provinceData = (state) => state.province;

export const selectProvince = createSelector([provinceData], (province) => province);
