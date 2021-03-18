import ReactDOM from 'react-dom';
// import './common.less';
import '../index.less';
// import './tool.less';
import settings from '../routers/dds';
import render from '../routers/render';

ReactDOM.render(render(settings, '/trade'), document.getElementById('root'));
