import * as React from 'react';
import './alert.css';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { RootState } from '../../redux/root-reducer';
import {
  hideout,
  selectAlertType,
  selectMessage,
  selectTimeout,
} from '../../redux/alert/alertSlice';
import { alert_type } from '../../redux/alert/alertSlice';
import { useEffect, useState } from 'react';

interface IAlert {
  message: string;
  atype: alert_type;
  timeout: number;
}

const Alert = ({ message, timeout }: IAlert) => {
  const dispatch = useDispatch();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (message) {
      setTimeout(hide, timeout);
      setPercentage(100);
      setTimeout(reset, timeout);
    }
  });

  function hide() {
    dispatch(hideout());
  }

  function reset() {
    setPercentage(0);
  }

  return (
    <div className='alert' style={{ opacity: message ? '1' : '0' }}>
      {message}
      <div className='filler' style={{ width: `${percentage}%` }} />
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, IAlert>({
  message: selectMessage,
  atype: selectAlertType,
  timeout: selectTimeout,
});

export default connect(mapStateToProps)(Alert);
