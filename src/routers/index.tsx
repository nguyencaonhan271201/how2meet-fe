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
import { Footer } from '../components/Footer/Footer';
import { CreateMeeting } from '../containers/CreateMeeting/CreateMeeting';
import { MeetingMinute } from '../containers/MeetingMinute/MeetingMinute';
import { MeetingImageUpload } from '../containers/MeetingImageUpload/MeetingImageUpload';
import { EditAccount } from '../containers/EditAccount/EditAccount';
import { MeetingPage } from '../containers/MeetingPage/MeetingPage';
import { EditMeeting } from '../containers/EditMeeting/EditMeeting';
import { MeetingMinuteDashboard } from '../containers/MeetingMinuteDashboard/MeetingMinuteDashboard';
import { FooterNoFixed } from '../components/FooterNoFixed/FooterNoFixed';
import { OnlyFooter150Layout } from '../layouts/OnlyFooter150Layout/OnlyFooter150Layout';
import { Statistics } from '../containers/Statistics/Statistics';
import { OnlyFooterFitContentLayout } from '../layouts/OnlyFooterFitContentLayout/OnlyFooterFitContentLayout';
import { Cronjobs } from '../containers/Cronjobs/Cronjobs';

export const Routers = () => {
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

        <PublicRouter
          exact={true}
          path={'/edit-account'}
          component={EditAccount}
          layout={OnlyFooterLayout}
          footer={Footer}
          isHasFooter={true}
        />

        <PrivateRouter
          exact={true}
          path={'/meetings'}
          component={MeetingDashboard}
          layout={OnlyFooterLayout}
          footer={Footer}
          isHasFooter={true}
        />

        <PrivateRouter
          exact={true}
          path={'/new-meeting'}
          component={CreateMeeting}
          layout={OnlyFooterLayout}
          footer={Footer}
          isHasFooter={true}
        />

        <PrivateRouter
          exact={true}
          path={'/meeting-image/:id'}
          component={MeetingImageUpload}
          layout={OnlyFooterLayout}
          footer={Footer}
          isHasFooter={true}
        />

        <PublicRouter
          exact={true}
          path={'/meeting/:id'}
          component={MeetingPage}
          layout={OnlyFooterLayout}
          footer={Footer}
          isHasFooter={true}
        />

        <PublicRouter
          exact={true}
          path={'/edit-meeting/:id'}
          component={EditMeeting}
          layout={OnlyFooterLayout}
          footer={Footer}
          isHasFooter={true}
        />

        <PrivateRouter
          exact={true}
          path={'/meeting-minute/:id'}
          component={MeetingMinuteDashboard}
          layout={OnlyFooterLayout}
          footer={Footer}
          isHasFooter={true}
        />

        <PrivateRouter
          exact={true}
          path={'/meeting-minute/:id/:minute_id'}
          component={MeetingMinute}
          layout={OnlyFooter150Layout}
          footer={FooterNoFixed}
          isHasFooter={true}
        />

        <PrivateRouter
          exact={true}
          path={'/meetings/statistics'}
          component={Statistics}
          layout={OnlyFooterFitContentLayout}
          footer={FooterNoFixed}
          isHasFooter={true}
        />

        <PublicRouter
          exact={true}
          path={'/cronjobs'}
          component={Cronjobs}
          layout={OnlyFooterLayout}
          isHasFooter={false}
        />


      </Switch>
    </Router>
  );
};
