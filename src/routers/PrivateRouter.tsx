import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';

export const PrivateRouter: React.FC<IPrivateRouter> = ({
  component: Component,
  layout: Layout,
  exact,
  path,
}) => {
  const Header = Component.Header ?? <></>;
  const Footer = Component.Footer ?? <></>;
  const Sidebar = Component.Sidebar ?? <></>;

  //CHECK IF NOT LOGGED IN
  const isLoggedIn = false;
  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Route
      exact={exact}
      path={path}
      render={(props: any) => {
        return (
          <Layout header={Header} footer={Footer}>
            <Component {...props} />
          </Layout>
        );
      }}
    />
  );
};
