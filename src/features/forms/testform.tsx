import * as React from 'react';
import './testform.css';

interface ILabelForm {
  label: string;
  htmlFor?: string;
}

type FieldLabels = {
  head: string;
  submit: string;
  labels: ILabelForm[];
};

type FieldTextarea = {
  name: string;
  id: string;
  placeholder: string;
  form: string;
  required: boolean;
  disabled: boolean;
  minLength: number;
  maxLength: number;
};

type SelectOptions = {
  value: string;
  id: string;
  label: string;
};

type FieldSelect = {
  name: string;
  form?: string;
  id?: string;
  required?: boolean;
  options: SelectOptions;
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

type FieldTypeArray = {
  input: FieldInputs;
  select: FieldSelect;
  textarea: FieldTextarea;
  labels: FieldLabels;
};

interface IProfileForm {
  fields: FieldTypeArray;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export function TestForm({ fields, onSubmit }: IProfileForm): JSX.Element {
  return (
    <form className='profile-form' onSubmit={onSubmit}>
      <h1 id='profile-form__headlabel'>{fields.labels.head}</h1>
      {fields.map((field) => {
        switch (field) {
          case 'input':
            return (
              <InputForm
                type={field.type}
                name={field.name}
                id={field.id}
                placeholder={field.placeholder}
                minLength={field.minLength}
                maxLength={field.maxLength}
                disabled={field.disabled}
                pattern={field.pattern}
                title={field.title}
                required={field.required}
              />
            );
          case 'label':
            return <LabelForm label={field.label} htmlFor={field.htmlFor} />;
          case 'select':
            return (
              <SelectForm
                form={field.form}
                name={field.name}
                id={field.id}
                options={field.options}
              />
            );
          case 'textarea':
            return (
              <TextareaForm
                name={field.name}
                id={field.id}
                placeholder={field.placeholder}
                form={field.form}
                required={field.required}
                disabled={field.disabled}
                maxLength={field.maxLength}
                minLength={field.minLength}
              />
            );
          default:
            return;
        }
      })}
      <button type='submit' disabled={false}>
        {fields.labels.submit}
      </button>
    </form>
  );
}

function LabelForm({ label, htmlFor }: ILabelForm): JSX.Element {
  return <label htmlFor={htmlFor}>{label}</label>;
}

function InputForm({
  type,
  name,
  id,
  placeholder,
  minLength,
  maxLength,
  disabled,
  pattern,
  title,
  required,
}: FieldInputs): JSX.Element {
  return (
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      minLength={minLength}
      maxLength={maxLength}
      disabled={disabled}
      pattern={pattern}
      title={title}
      required={required}
    />
  );
}

function SelectForm({ form, name, id, options }: FieldSelect): JSX.Element {
  return (
    <select form={form} name={name} id={id}>
      {
        <option value={options.value} key={options.id}>
          {options.label}
        </option>
      }
    </select>
  );
}

function TextareaForm({
  name,
  id,
  placeholder,
  form,
  required,
  disabled,
  maxLength,
  minLength,
}: FieldTextarea): JSX.Element {
  return (
    <textarea
      name={name}
      id={id}
      placeholder={placeholder}
      form={form}
      required={required}
      disabled={disabled}
      minLength={minLength}
      maxLength={maxLength}
    ></textarea>
  );
}
