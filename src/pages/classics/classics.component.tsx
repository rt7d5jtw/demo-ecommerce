import * as React from 'react';
import './classics.css';
import Alert from '../../components/alert/alert.component';
import { useDispatch } from 'react-redux';
import { RootState } from '../../redux/root-reducer';
import { productAdded, productDeleted, cartCleared, userLogged, userRegistered } from '../../redux/alert/alert.actions';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectMessage } from '../../redux/alert/alert.selectors';
import { OrderCard } from '../../components/order-card/order-card.component';

interface IClassics {
  message: string;
}

const Classics = ({ message }: IClassics) => {
  const dispatch = useDispatch();

  return (
    <div className='classics'>
      <Alert />
      <button className='cl-btn' onClick={() => dispatch(productAdded())}>Add item</button>
      <button className='cl-btn' onClick={() => dispatch(productDeleted())}>Delete item</button>
      <button className='cl-btn' onClick={() => dispatch(cartCleared())}>Clear Cart</button>
      <button className='cl-btn' onClick={() => dispatch(userLogged())}>Log in</button>
      <button className='cl-btn' onClick={() => dispatch(userRegistered())}>Register</button>

      <div className='owrapper'>
          <OrderCard image={'https://i.imgur.com/yadQN6X.png'} title={'WD Watch'} ordernum={'114a42d6-3acf-4694-a03b-a774674fa7a9'} date={'16-4-2021'}/>
      </div>

    </div>
  );
}



const mapStateToProps = createStructuredSelector<RootState, IClassics>({
  message: selectMessage,
})

export default connect(mapStateToProps)(Classics);
