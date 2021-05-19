import * as React from 'react';
import './main.css';

interface Props {
  children: React.ReactNode;
}

function Main(props: Props): JSX.Element {
  return (
    <div className='main'>
      <div className='main-wrapper'>{props.children}</div>
    </div>
  );
}

export default Main;
