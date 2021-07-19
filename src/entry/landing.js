import ReactDOM from 'react-dom';
import '../landing.less';
import landingSettings from '../routers/landing';
import render from '../routers/render';

const setRootRem = () => {
  const currentW = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  window.document.documentElement.style.fontSize = parseInt((Math.max(currentW, 600) / 1080) * 100) + 'px';
};

setRootRem();

window.addEventListener('resize', setRootRem);

ReactDOM.render(render(landingSettings, '/home'), document.getElementById('root'));
