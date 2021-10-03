import * as React from 'react';
import './alert.css';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import { hideout, selectAlertType, selectMessage } from '../../alert/alertSlice';
import { alert_type } from '../../alert/alertSlice';

interface IAlert {
  message: string;
  atype: alert_type;
  timeout?: number;
}

const Alert = ({ message, timeout = 3500 }: IAlert) => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    fade: 0,
    mounted: 0,
  });

  React.useEffect(() => {
    if (message.length > 0) {
      setState({ ...state, fade: 1 });
      setTimeout(hide, timeout);
    }
  }, []);

  function hide() {
    setState({ ...state, fade: 0 });
    setTimeout(() => dispatch(hideout()), timeout);
  }

  return (
    <div className='alert' style={state.fade === 0 ? { opacity: '0' } : { opacity: '1' }}>
      <p className='alert__message'>{message}</p>
    </div>
  );
};

type AlertState = {
  message: string;
  atype: alert_type;
};

const mapStateToProps = createStructuredSelector<RootState, AlertState>({
  message: selectMessage,
  atype: selectAlertType,
});

export default connect(mapStateToProps)(Alert);
