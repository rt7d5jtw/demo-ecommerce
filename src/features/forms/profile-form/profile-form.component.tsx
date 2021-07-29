import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectUserErrors } from '../../user/selectors';
import './profile-form.css';

type FieldLabels = {
  head: string;
  labelx: string;
  labely: string;
  submit: string;
};

type FieldInputs = {
  type: string;
  name: string;
  pattern?: string;
  required?: boolean;
  title?: string;
  minLength?: number;
  maxLength?: number;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
};

type InputArrayType = {
  inputx: FieldInputs;
  inputy: FieldInputs;
};

type FieldWarnings = {
  statusCode?: string;
  message: string;
  error?: string;
};

type FieldTypes = {
  warning?: FieldWarnings;
  labels: FieldLabels;
  inputs: InputArrayType;
};

interface IProfileForm {
  fields: FieldTypes;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export function ProfileForm({ fields, onSubmit }: IProfileForm): JSX.Element {
  //const errors = useSelector(selectUserErrors);
  const [warning, setWarning] = React.useState({
    statusCode: '',
    message: '',
    error: '',
  });
  const [input, updateInput] = React.useState<{ [key: string]: string }>({});

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    updateInput({ ...input, [name]: value });

    if (warning.message.length > 0 && value.length === 0) {
      setWarning({ statusCode: '', message: '', error: '' });
    }
  }

  /*
  React.useEffect(() => {
    setWarning({
      ...warning,
      message: errors.message,
      statusCode: errors.statusCode,
      error: errors.error,
    });
  }, [errors]);
     */

  return (
    <form className='profile-form' onSubmit={onSubmit}>
      <h1 id='profile-form__headlabel'>{fields.labels.head}</h1>
      <label>{fields.labels.labelx}</label>
      <input
        type={fields.inputs.inputx.type}
        name={fields.inputs.inputx.name}
        id={fields.inputs.inputx.id}
        placeholder={fields.inputs.inputx.placeholder}
        minLength={fields.inputs.inputx.minLength}
        maxLength={fields.inputs.inputx.maxLength}
        disabled={fields.inputs.inputx.disabled}
        pattern={fields.inputs.inputx.pattern}
        title={fields.inputs.inputx.title}
        required={fields.inputs.inputx.required}
        onChange={handleChange}
      />
      <label>{fields.labels.labely}</label>
      <input
        type={fields.inputs.inputy.type}
        name={fields.inputs.inputy.name}
        id={fields.inputs.inputy.id}
        placeholder={fields.inputs.inputy.placeholder}
        disabled={fields.inputs.inputy.disabled}
        pattern={fields.inputs.inputy.pattern}
        minLength={fields.inputs.inputy.minLength}
        maxLength={fields.inputs.inputy.maxLength}
        title={fields.inputs.inputy.title}
        required={fields.inputs.inputy.required}
        onChange={handleChange}
      />
      <p
        className='warning-text'
        style={warning && warning.message.length > 0 ? { display: 'inline' } : {}}
      >
        {warning.message}
      </p>
      <button type='submit' disabled={false}>
        {fields.labels.submit}
      </button>
    </form>
  );
}
