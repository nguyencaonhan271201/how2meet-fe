import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

//Routers
import { PrivateRouter } from './PrivateRouter';
import { PublicRouter } from './PublicRouter';

//Containers
import { LoginPage } from '../containers/LoginPage/LoginPage';

//Layouts
import { OnlyFooterLayout } from '../layouts/OnlyFooterLayout/OnlyFooterLayout';
import { FullLayout } from '../layouts/FullLayout/FullLayout';

export const Routers = () => {
  // const buildysURL = process.env.REACT_APP_LINK_BUILDYS;

  return (
    <Router>
      <Switch>
        <PublicRouter exact={true} path={'/'} component={LoginPage} layout={FullLayout} />

        <PublicRouter
          exact={true}
          path={'/abc'}
          component={LoginPage}
          layout={OnlyFooterLayout}
        />

      </Switch>
    </Router>
  );
};
