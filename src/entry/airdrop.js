import ReactDOM from 'react-dom';
import '../index.less';
import { routes } from '../routers/airdrop';
import render from '../routers/render';

ReactDOM.render(render(routes, '/claim'), document.getElementById('root'));
