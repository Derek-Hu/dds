import ReactDOM from 'react-dom';
// import './common.less';
import '../index.less';
// import './tool.less';
import landingSettings from '../routers/landing';
import render from '../routers/render';

ReactDOM.render(render(landingSettings, '/home'), document.getElementById('root'));
