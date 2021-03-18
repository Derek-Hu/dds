import { IRouter } from "./render";

import Layout from '../layouts/index';

import HomePage from '../pages/home.page';

const routers: IRouter[] = [
  {
    path: "/",
    component: Layout,
    routes: [
      { path: "/home", component: HomePage },
    ],
  }
];

export default routers;