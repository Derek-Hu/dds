import React from "react";
import ReactDOM from "react-dom";

import './index.less';
import settings from "./routers/settings";
import render from "./routers/render";

ReactDOM.render(render(settings), document.getElementById("root"));
