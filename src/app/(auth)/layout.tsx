import React, { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {}

const AuthLayout = (props: Props) => {
  return <div className="h-screen flex justify-center items-center">{props.children}</div>;
};

export default AuthLayout;
