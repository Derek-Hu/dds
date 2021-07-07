import { IRouter } from './render';

import Layout from '../layouts/index';

import LandingPage from '../pages/landing.page';

const routers: IRouter[] = [
  {
    path: '/',
    component: Layout,
    routes: [{ path: '/home', component: LandingPage }],
  },
];

export default routers;
