import * as React from 'react';
import './creator-main.css';

function CreatorMain(props: any): JSX.Element {
  return <div className='creator-main'>{props.children}</div>;
}

export default CreatorMain;
