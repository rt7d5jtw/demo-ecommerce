import * as React from 'react';
import './creator-main.css';

function CreatorMain(props: JSX.ElementChildrenAttribute): JSX.Element {
  return <div className='creator-main'>{props.children}</div>;
}

export default CreatorMain;
