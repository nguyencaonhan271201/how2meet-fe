import React, { useEffect, useState } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../configs/firebase';

export const PrivateRouter: React.FC<IPrivateRouter> = ({
  component: Component,
  layout: Layout,
  exact,
  path,
  header: Header,
  footer: Footer,
  isHasHeader,
  isHasFooter,
}) => {
  const history = useHistory();

  useEffect(() => {
    let getItem = localStorage.getItem("firebaseLoggedIn");
    if (getItem === "0") {
      history.push("/auth", { isRedirect: true })
    }
  }, []);

  return (
    <Route
      exact={exact}
      path={path}
      render={(props: any) => {
        return (
          <Layout
            header={isHasHeader ? <Header /> : <></>}
            footer={isHasFooter ? <Footer /> : <></>}
          >
            <Component {...props} />
          </Layout>
        );
      }}
    />
  );
};
