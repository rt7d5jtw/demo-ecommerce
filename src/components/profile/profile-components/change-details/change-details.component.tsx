import * as React from 'react';
import './change-details.css';
import { useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Inputs } from '../../../../components/register/register.component';

const ChangeDetails = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data)

    if (user.email && user.password) {
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(user => ({ ...user, [name]: value }));
  }

  return (
    <div className='profile-overview'>
      <div className='profile-details-wrapper'>
        <div className='profile-password'>
          <h1>Change my details</h1>
          <form className='profile-form'>
          <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="New address"
              required
            />
            {errors?.email && <p className='profile-text'>{errors.email.message}</p>}
            <div>
            <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="New name"
              />
            {errors?.password && <p className='profile-text'>{errors.password.message}</p>}
            </div>

            <button type="button" onClick={handleSubmit(onSubmit)}>Save Details</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangeDetails;
