import ReactDOM from "react-dom";

import './index.less';
// import './tool.less';
import settings from "./routers/settings";
import render from "./routers/render";

ReactDOM.render(render(settings), document.getElementById("root"));