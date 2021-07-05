import { IRouter } from './render';

import Layout from '../layouts/index';

import OldPage from '../pages/old.page';

const routers: IRouter[] = [
  {
    path: '/',
    component: Layout,
    routes: [{ path: '/home', component: OldPage }],
  },
];

export default routers;
