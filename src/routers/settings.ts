import { IRouter } from "./render";

import HomeLayout from '../layouts/home.layout';

import BorkerPage from '../pages/broker.page';
import HomePage from '../pages/home.page';
import MiningPage from '../pages/mining.page';
import PoolPage from '../pages/pool.page';
import SwapBurnPage from '../pages/swap-burn.page';
import TradePage from '../pages/trade.page';
import Page404 from '../pages/404.page';

const routers: IRouter[] = [
  {
    path: "/",
    component: HomeLayout,
    routes: [
      { path: "/home", component: HomePage },
      { path: "/mining", component: MiningPage },
      { path: "/broker", component: BorkerPage },
      { path: "/pool", component: PoolPage },
      { path: "/swap-burn", component: SwapBurnPage },
      { path: "/trade", component: TradePage },
      { path: "/404", component: Page404 },
    ],
  },
];

export default routers;