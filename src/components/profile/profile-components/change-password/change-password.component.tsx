import * as React from 'react';
import './change-password.css';
import { useState, ChangeEvent } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Inputs } from '../../../../components/register/register.component';
import { passwordChange } from '../../../../redux/user/user.actions';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [pass, setPass] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data: any) => {
      console.log(data);
      dispatch(passwordChange(data));
    }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPass(pass => ({ ...pass, [name]: value }));
  }

  return (
    <div className='profile-overview'>
      <div className='profile-overview-wrapper'>
        <div className='profile-password'>
          <h1>Change my password</h1>
          <form className='profile-form'>
          <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={pass.currentPassword}
              placeholder="Current password"
              onChange={handleChange}
              ref={register({ required: "You must specify a password", minLength: { value: 6, message: "Passwords must have at least 6 characters" } , maxLength: 150 })}
              required
            />
            {errors?.email && <p className='profile-text'>{errors.email.message}</p>}
            <div>
            <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={pass.newPassword}
                placeholder="New password"
                onChange={handleChange}
                ref={register({ required: "You must specify a password", minLength: { value: 6, message: "Passwords must have at least 6 characters" } , maxLength: 150 })}
              />
            {errors?.password && <p className='profile-text'>{errors.password.message}</p>}
            </div>

            <button type="button" onClick={handleSubmit(onSubmit)}>Save Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
