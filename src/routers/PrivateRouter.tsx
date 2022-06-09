import React, { useEffect, useState } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../configs/firebase';

export const PrivateRouter: React.FC<IPrivateRouter> = ({
  component: Component,
  layout: Layout,
  exact,
  path,
}) => {
  const Header = Component.Header ?? <></>;
  const Footer = Component.Footer ?? <></>;
  const Sidebar = Component.Sidebar ?? <></>;

  const history = useHistory();

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      //NAVIGATE IF NOT LOGGED IN
      if (!user) {
        history.push("/auth");
      }
    });
  }, []);

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
