import * as React from 'react';
import './alert.css';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import {
  hideout,
  selectAlertType,
  selectMessage,
  selectTimeout,
} from '../../alert/alertSlice';
import { alert_type } from '../../alert/alertSlice';

interface IAlert {
  message: string;
  atype: alert_type;
  timeout?: number;
}

const Alert = ({ message }: IAlert) => {
  const dispatch = useDispatch();
  const timeout = useSelector(selectTimeout);
  const [state, setState] = React.useState({
    fade: 0,
    mounted: 0,
  });

  React.useEffect(() => {
    /* waits for hideout function to clear the state */
    if (message.length > 0) {
      setState({ ...state, fade: 1 });
      setTimeout(hide, timeout);
    }
  }, []);

  function hide() {
    setState({ ...state, fade: 0 });
    /* clears the state */
    setTimeout(() => dispatch(hideout()), timeout);
  }

  return (
    <div
      className='alert'
      style={state.fade === 0 ? { opacity: '0' } : { opacity: '1' }}
    >
      <span id='alert__close' onClick={() => dispatch(hideout())}>
        X
      </span>
      <p className='alert__message'>{message}</p>
    </div>
  );
};

type AlertState = {
  message: string;
  atype: alert_type;
  timeout?: number;
};

const mapStateToProps = createStructuredSelector<RootState, AlertState>({
  message: selectMessage,
  atype: selectAlertType,
});

export default connect(mapStateToProps)(Alert);
