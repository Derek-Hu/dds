import ReactDOM from 'react-dom';
import '../landing.less';
import landingSettings from '../routers/landing';
import render from '../routers/render';

const currentW = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
window.document.documentElement.style.fontSize = parseInt((currentW / 1080) * 100) + 'px';

ReactDOM.render(render(landingSettings, '/home'), document.getElementById('root'));
