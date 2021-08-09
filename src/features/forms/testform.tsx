import * as React from 'react';
import './testform.css';

interface ILabelForm {
  orderIdentifier: number;
  label: string;
  htmlFor?: string;
  key?: string | number;
}

type FieldTextarea = {
  orderIdentifier: number;
  name: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  form: string;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  cols?: number;
  onChange?: React.ChangeEventHandler;
};

type SelectOptions = {
  value: string;
  id: string;
  label: string;
};

type FieldSelect = {
  orderIdentifier: number;
  name: string;
  form?: string;
  id?: string;
  required?: boolean;
  options: SelectOptions[];
  onChange?: React.ChangeEventHandler;
};

type FieldInputs = {
  orderIdentifier: number;
  type: string;
  name: string;
  pattern?: string;
  required?: boolean;
  title?: string;
  minLength?: number;
  maxLength?: number;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler;
};

type FieldTypeArray = {
  labels?: ILabelForm[];
  input?: FieldInputs[];
  select?: FieldSelect[];
  textarea?: FieldTextarea[];
};

interface IProfileForm {
  fields: FieldTypeArray;
  headlabel: string;
  submitlabel: string;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export function TestForm({ fields, onSubmit, headlabel, submitlabel }: IProfileForm): JSX.Element {
  const parsed = parseFormJSON(fields);
  return (
    <form className='badumts-form' onSubmit={onSubmit}>
      <h1 id='badumts-form__headlabel'>{headlabel}</h1>
      {parsed.map((com) => {
        switch (com.component) {
          case 'input':
            return (
              <InputForm
                orderIdentifier={com.orderIdentifier}
                name={com.name}
                id={com.id}
                placeholder={com.placeholder}
                defaultValue={com.defaultValue}
                value={com.value}
                title={com.title}
                type={com.type}
                required={com.required}
                onChange={com.onChange}
              />
            );
          case 'labels':
            return (
              <LabelForm
                orderIdentifier={com.orderIdentifier}
                htmlFor={com.htmlFor}
                label={com.label}
              />
            );
          case 'select':
            return (
              <SelectForm
                orderIdentifier={com.orderIdentifier}
                form={com.form}
                id={com.id}
                name={com.name}
                options={com.options}
                onChange={com.onChange}
              />
            );
          case 'textarea':
            return (
              <TextareaForm
                orderIdentifier={com.orderIdentifier}
                form={com.form}
                name={com.name}
                id={com.id}
                placeholder={com.placeholder}
                defaultValue={com.defaultValue}
                rows={com.rows}
                cols={com.cols}
                onChange={com.onChange}
              />
            );
          default:
            return;
        }
      })}
      <button type='submit' disabled={false}>
        {submitlabel}
      </button>
    </form>
  );
}

type OrderedFormOutput = {
  orderIdentifier: number;
  component: string;
  element: ComponentType;
};

type ComponentType = ILabelForm | FieldInputs[] | FieldSelect[] | FieldTextarea[];

export function parseFormJSON(fields: any) {
  const ids = [];
  const storage = [];
  for (const i in fields) {
    ids.push({ [i]: fields[i].length });
    storage.push(fields[i].map((v: any) => ({ ...v, component: i })));
  }
  return storage
    .flat()
    .sort((a, b) =>
      a.orderIdentifier > b.orderIdentifier ? 1 : a.orderIdentifier < b.orderIdentifier ? -1 : 0
    );
}

function LabelForm({ label, htmlFor, key }: ILabelForm): JSX.Element {
  return <label key={key} htmlFor={htmlFor}>{label}</label>;
}

function InputForm({
  type,
  name,
  id,
  placeholder,
  defaultValue,
  value,
  minLength,
  maxLength,
  disabled,
  pattern,
  title,
  required,
  onChange,
}: FieldInputs): JSX.Element {
  return (
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      minLength={minLength}
      maxLength={maxLength}
      disabled={disabled}
      pattern={pattern}
      title={title}
      required={required}
      onChange={onChange}
    />
  );
}

function SelectForm({ form, name, id, options, onChange }: FieldSelect): JSX.Element {
  return (
    <select form={form} name={name} id={id} onChange={onChange}>
      {options.map(({ id, label, value }) => (
        <option value={value} key={id}>
          {label}
        </option>
      ))}
    </select>
  );
}

function TextareaForm({
  name,
  id,
  placeholder,
  defaultValue,
  form,
  required,
  disabled,
  maxLength,
  minLength,
  rows,
  cols,
  onChange,
}: FieldTextarea): JSX.Element {
  return (
    <textarea
      name={name}
      id={id}
      placeholder={placeholder}
      defaultValue={defaultValue}
      form={form}
      required={required}
      disabled={disabled}
      rows={rows}
      cols={cols}
      minLength={minLength}
      maxLength={maxLength}
      onChange={onChange}
    ></textarea>
  );
}
