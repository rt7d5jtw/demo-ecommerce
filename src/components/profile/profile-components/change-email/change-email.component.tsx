import * as React from 'react';
import './change-email.css';
import { useDispatch } from 'react-redux';
import { useState, ChangeEvent } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Inputs } from '../../../../components/register/register.component';

const ChangeEmail = () => {
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
      <div className='profile-overview-wrapper'>
        <div className='profile-password'>
          <h1>Change my email</h1>
          <form className='profile-form'>
          <label>Current Email</label>
            <input
              type="email"
              name="email"
              placeholder="Current email"
              required
            />
            {errors?.email && <p className='profile-text'>{errors.email.message}</p>}
            <div>
            <label>New Email</label>
              <input
                type="email"
                name="email"
                placeholder="New email"
              />
            {errors?.email && <p className='profile-text'>{errors.email.message}</p>}
            </div>

            <button type="button" onClick={handleSubmit(onSubmit)}>Save Email</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangeEmail;
