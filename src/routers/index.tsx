import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

//Routers
import { PrivateRouter } from './PrivateRouter';
import { PublicRouter } from './PublicRouter';

//Containers
import { LoginPage } from '../containers/LoginPage/LoginPage';
import { RegisterPage } from '../containers/RegisterPage/RegisterPage';
import { LandingPage } from '../containers/LandingPage/LandingPage';
import { MeetingDashboard } from '../containers/MeetingDashboard/MeetingDashboard';

//Layouts
import { OnlyFooterLayout } from '../layouts/OnlyFooterLayout/OnlyFooterLayout';
import { FullLayout } from '../layouts/FullLayout/FullLayout';

export const Routers = () => {
  // const buildysURL = process.env.REACT_APP_LINK_BUILDYS;

  return (
    <Router>
      <Switch>
        <PublicRouter exact={true} path={'/'} component={LandingPage} layout={FullLayout} />

        <PublicRouter
          exact={true}
          path={'/auth'}
          component={LoginPage}
          layout={OnlyFooterLayout}
        />

        <PublicRouter
          exact={true}
          path={'/auth/register'}
          component={RegisterPage}
          layout={OnlyFooterLayout}
        />

        <PrivateRouter
          exact={true}
          path={'/meetings'}
          component={MeetingDashboard}
          layout={FullLayout}
        />

      </Switch>
    </Router>
  );
};
