import { IRouter } from './render';
import AirDropPage from '../components/activities/air-drop/air-drop-page';
import AirdropLayout from '../layouts/airdrop.layout';

export const routes: IRouter[] = [
  {
    path: '/',
    component: AirdropLayout,
    routes: [
      {
        path: '/claim',
        component: AirDropPage,
      },
    ],
  },
];
