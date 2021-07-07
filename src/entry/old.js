import ReactDOM from 'react-dom';
// import './common.less';
import '../index.less';
// import './tool.less';
import homeSettings from '../routers/home';
import render from '../routers/render';

ReactDOM.render(render(homeSettings, '/home'), document.getElementById('root'));
