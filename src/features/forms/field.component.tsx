import * as React from 'react';

interface FormInputOpts {
  type: string;
  name: string;
  id?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  pattern?: string;
  title?: string;
  required?: boolean;
}

interface IFormField {
  label: string;
  input: FormInputOpts;
  warning?: boolean;
}

function FormField({ label, input, warning }: IFormField): JSX.Element {
  const [error, setError] = React.useState({
    message: '',
  });
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event);
  }
  return (
    <div className='form-field'>
      <form>
        <label htmlFor={input.id}>{label}</label>
        <input
          type={input.type}
          name={input.name}
          id={input.id}
          placeholder={input.placeholder}
          minLength={input.minLength}
          maxLength={input.maxLength}
          disabled={input.disabled}
          pattern={input.pattern}
          title={input.title}
          required={input.required}
          onChange={handleChange}
        />
        {warning ? <p>{error.message}</p> : null}
      </form>
    </div>
  );
}
export default FormField;
