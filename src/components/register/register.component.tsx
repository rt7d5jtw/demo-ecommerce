import * as React from 'react';
import { ChangeEvent } from 'react';
import './register.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest } from '../../redux/user/user.actions';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { userRegistered } from '../../redux/alert/alert.actions';

export type Inputs = {
  email: string;
  password: string;
  confirm_password: string;
}

export const Register = () => {

  let { push } = useHistory();
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, errors, watch } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data)
    push('/login')

    if (user.email && user.password) {
      setSubmitted(true);
      dispatch(registerRequest(data));
      dispatch(userRegistered());
    }
  }

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;
  const { requesting } = useSelector((state: any) => state.user.requesting)
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(user => ({ ...user, [name]: value }));
  }

  return (
  <div className='register'>
    <div className='register-picture' style={{backgroundImage:`url('https://i.imgur.com/Esf8WO9.jpg')`}}>
    </div>
    <div className='registration-wrapper'>
        <h1>Register</h1>
      <form className='form'>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={user.email}
          placeholder="Email"
          onChange={handleChange}
          ref={register({ required: "You must specify an email" })}
          required
        />
        {errors?.email && <p className='register-text'>{errors.email.message}</p>}
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            placeholder="Password"
            onChange={handleChange}
            ref={register({ required: "You must specify a password", minLength: { value: 6, message: "Passwords must have at least 6 characters" } , maxLength: 150 })}
            required
          />
          {errors?.password && <p className='register-text'>{errors.password.message}</p>}
          <label>Confirm Password</label>
          <input 
            type="password" 
            name="confirm_password" 
            ref={register({ validate: (value) => value === watch('password') || "Passwords don't match"})} 
          placeholder="Confirm Password" 
          required />
      </div>
        {errors?.confirm_password && <p className='register-text'>{errors.confirm_password.message}</p>}
          <button type="button" onClick={handleSubmit(onSubmit)}>Register</button>
      </form>
    </div>
    </div>
  );
}
