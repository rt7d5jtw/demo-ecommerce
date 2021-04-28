import * as React from 'react';
import './second-header.css';

function SecondHeader(props: any) {
  return (
    <div className='second-header'>
      {props.children}
    </div>
  )
}

export default SecondHeader;
