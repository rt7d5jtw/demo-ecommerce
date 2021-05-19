import * as React from 'react';
import './admin-main.css';

export function AdminMain(props: JSX.ElementChildrenAttribute): JSX.Element {
  return <div className='admin-main'>{props.children}</div>;
}
