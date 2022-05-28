interface IPublicRouter {
  component: any;
  layout: any;
  path: string;
  exact?: boolean;
  header?: any;
  footer?: any;
  isHasFooter?: boolean;
  isHasHeader?: boolean;
}

interface IPrivateRouter {
  component: any;
  layout: any;
  path: string;
  exact?: boolean;
  header?: any;
  footer?: any;
  isHasFooter?: boolean;
  isHasHeader?: boolean;
  exact?: boolean;
}