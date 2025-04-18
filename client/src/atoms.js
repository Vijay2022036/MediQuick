import { atom } from 'recoil';

const isAuthenticated = atom({
  key: 'isAuthenticated',
  default: false,
});

const reportsState = atom({
  key: 'reportsState',
  default: [],
});

const pharmaciesState = atom({
  key: 'pharmaciesState',
  default: [],
});

const ordersState = atom({
  key: 'ordersState',
  default: [],
});

const deliveryAgentsState = atom({
  key: 'deliveryAgentsState',
  default: [],
});

const usersState = atom({
  key: 'usersState',
  default: [],
});


export { isAuthenticated, reportsState, pharmaciesState, ordersState, deliveryAgentsState, usersState };