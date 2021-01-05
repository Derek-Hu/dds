import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export interface IRouter {
  path: string;
  component: any;
  target?: '_blank';
  routes?: IRouter[];
  title?: string;
}

const renderItems = (items?: IRouter[]) => {
  return (
    <Switch>
      <div>
        {items ? items.map(({ routes, path, component: Component }) => {
          const exact = routes && routes.length;
          if (exact) {
            return (
              <Route
                path={path}
                render={(routeProps: any) => (
                  <Component {...routeProps}>{renderItems(routes)}</Component>
                )}
              ></Route>
            );
          }
          return <Route exact={true} path={path} component={Component}></Route>;
        }): null}
      </div>
    </Switch>
  );
};

export default (settings: IRouter[]) => {
  return (
    <Router>
      <div>{renderItems(settings)}</div>
    </Router>
  );
};
