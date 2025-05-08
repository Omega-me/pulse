'use client';
import { store } from '@/redux/store';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

interface Props extends PropsWithChildren {}

const ReduxProvider = (props: Props) => {
  return <Provider store={store}>{props.children}</Provider>;
};

export default ReduxProvider;
