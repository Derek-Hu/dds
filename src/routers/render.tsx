import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

export interface IRouter {
  path: string;
  component: any;
  target?: '_blank';
  routes?: IRouter[];
  title?: string;
}

const renderItems = (items: IRouter[], defaultPath: string) => {
  return (
    <Switch>
      {items
        ? items.map(({ routes, path, component: Component }) => {
            const exact = routes && routes.length;
            if (exact) {
              return (
                <Route
                  key={path}
                  path={path}
                  render={(routeProps: any) => (
                    <Component {...routeProps}>{renderItems(routes!, defaultPath)}</Component>
                  )}
                />
              );
            }
            return <Route exact={true} key={path} path={path} component={Component} />;
          })
        : null}
      <Route
        render={() => (
          <Redirect
            to={{
              pathname: defaultPath,
            }}
          />
        )}
      />
    </Switch>
  );
};

export default (settings: IRouter[], defaultPath: string) => {
  return (
    <Router>
      <div>{renderItems(settings, defaultPath)}</div>
    </Router>
  );
};
