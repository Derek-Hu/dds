import ReactDOM from 'react-dom';
import '../landing.less';
import landingSettings from '../routers/landing';
import render from '../routers/render';

ReactDOM.render(render(landingSettings, '/home'), document.getElementById('root'));
