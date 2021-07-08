import ReactDOM from 'react-dom';
import '../landing.less';
import landingSettings from '../routers/landing';
import render from '../routers/render';

const currentW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
window.document.documentElement.style.fontSize = parseInt((currentW / 1920) * 100) + 'px';

ReactDOM.render(render(landingSettings, '/home'), document.getElementById('root'));
