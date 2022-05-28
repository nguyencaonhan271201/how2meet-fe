import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';

export const PublicRouter: React.FC<IPublicRouter> = ({
  exact,
  path,
  component: Component,
  layout: Layout,
  header: Header,
  footer: Footer,
  isHasFooter,
  isHasHeader,
}) => {
  return (
    <Route
      exact={exact}
      path={path}
      render={(props: any) => {
        return (
          <Layout
            header={
              <></>
            }
            footer={<></>}
          >
            <Component {...props} />
          </Layout>
        );
      }}
    />
  );
};
