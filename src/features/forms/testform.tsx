import * as React from 'react';
import './testform.css';

interface IFormWarning {
  orderIdentifier: number;
  warning: string;
}

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
  form?: string;
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

type MultipleFieldSelect = {
  orderIdentifier: number;
  label: string;
  form?: string;
  name: string;
  id?: string;
  required?: boolean;
  options: SelectOptions[];
  onChange?: React.ChangeEventHandler;
};

type FieldSelect = {
  orderIdentifier: number;
  name: string;
  form?: string;
  id?: string;
  required?: boolean;
  multiple?: boolean;
  options: SelectOptions[];
  onChange?: React.ChangeEventHandler;
};

type FieldInputs = {
  orderIdentifier: number;
  type: string;
  name: string;
  step?: string;
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
  multiselect?: MultipleFieldSelect[];
  textarea?: FieldTextarea[];
  warning?: IFormWarning[];
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
    <form id='badumts-form' className='badumts-form' onSubmit={onSubmit}>
      <h1 id='badumts-form__headlabel'>{headlabel}</h1>
      {parsed.map((com) => {
        switch (com.component) {
          case 'input':
            return (
              <InputForm
                orderIdentifier={com.orderIdentifier}
                name={com.name}
                id={com.id}
                step={com.step}
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
                multiple={com.multiple}
                options={com.options}
                onChange={com.onChange}
              />
            );
          case 'multiselect':
            return (
              <MultipleSelectForm
                orderIdentifier={com.orderIdentifier}
                form={com.form}
                id={com.id}
                name={com.name}
                options={com.options}
                onChange={com.onChange}
                required={com.required}
                label={com.label}
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
          case 'warning':
            return <FormWarning warning={com.warning} orderIdentifier={com.orderIdentifier} />;
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
  return (
    <label key={key} htmlFor={htmlFor}>
      {label}
    </label>
  );
}

function InputForm({
  type,
  name,
  id,
  step,
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
      step={step}
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

function SelectForm({ form, name, id, multiple, options, onChange }: FieldSelect): JSX.Element {
  return (
    <select multiple={multiple} form={form} name={name} id={id} onChange={onChange}>
      {options.map(({ id, label, value }) => (
        <option value={value} key={id}>
          {label}
        </option>
      ))}
    </select>
  );
}

type FormValue = {
  value: string;
  index: number;
};

type FormAction = { type: 'open'; payload: boolean } | { type: 'values'; payload: FormValue };

export function MultipleSelectForm({
  required,
  form,
  id,
  name,
  label,
  options,
  onChange,
}: MultipleFieldSelect): JSX.Element {
  function addToState(state: FormValue[], item: FormValue): FormValue[] {
    if (state.length === 0) {
      return [...state, item];
    }
    const existingItem = state.find((e) => item.value === e.value);
    if (existingItem) {
      return state.filter((e) => e.value !== item.value);
    }
    return [...state, { ...item }];
  }
  function formReducer(state: typeof initialState, action: FormAction): FormState {
    switch (action.type) {
      case 'open': {
        return {
          ...state,
          open: action.payload,
        };
      }
      case 'values': {
        return {
          ...state,
          values: addToState(state.values, action.payload),
        };
      }
      default:
        return state;
    }
  }
  type FormState = {
    open: boolean;
    values: FormValue[];
  };
  const initialState: FormState = {
    open: false,
    values: [],
  };
  const [formState, formDispatch] = React.useReducer(formReducer, initialState);
  const uref = React.useRef<null | HTMLDivElement>(null);
  const jref = React.useRef<null | HTMLDivElement>(null);
  const kref = React.useRef<null | HTMLSelectElement>(null);

  const handleClickOutside = (event: Event) => {
    if (
      formState.open === true &&
      uref.current &&
      jref.current &&
      !uref.current.contains(event.target as Node) &&
      !jref.current.contains(event.target as Node)
    ) {
      formDispatch({ type: 'open', payload: !formState.open });
    }
  };

  const formStruct: any[] = [];
  const testEl: HTMLOptionElement[] = [];

  React.useEffect(() => {
    kref.current && formStruct.length === 0
      ? Array.from(kref.current.childNodes).forEach((e) => {
          formStruct.push({
            value: (e as HTMLOptionElement).value,
            index: (e as HTMLOptionElement).index,
          });
        })
      : null;
    kref.current
      ? kref.current.childNodes.forEach((e) => {
          testEl.push(e as HTMLOptionElement);
        })
      : null;
  }, [formStruct]);

  function clickHandler(event: React.MouseEvent<HTMLDivElement | HTMLOptionElement>) {
    if (!Array.from(event.currentTarget.classList).includes('item')) {
      formDispatch({ type: 'open', payload: !formState.open });
    }
    if (kref.current && event.currentTarget.classList.contains('item')) {
      const refVal = event.currentTarget.dataset['value'];
      const itemToSend = formStruct.find((e) => e.value === refVal);
      Array.from(kref.current.options).forEach((e) => {
        if (e.value === refVal) {
          e.selected = !e.selected;
        }
      });
      formDispatch({ type: 'values', payload: itemToSend });
    }
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [formState.open]);

  return (
    <div id={id} className='multiple-select'>
      <div className='label' ref={uref} onClick={(e) => clickHandler(e)}>
        {label}
      </div>
      <select
        required={required}
        multiple
        form={form}
        name={name}
        id={id}
        onChange={onChange}
        ref={kref}
      >
        {options.map(({ id, label, value }) => (
          <option value={value} key={id}>
            {label}
          </option>
        ))}
      </select>
      <div ref={jref} className={formState.open ? 'multiple-ul--open' : 'multiple-ul--closed'}>
        {options.map(({ value, id, label }) => (
          <div
            onClick={(e) => clickHandler(e)}
            className={formState.open ? 'item li--open' : 'item li--closed'}
            style={formState.values.find((e) => e.value === value) ? { background: 'gray' } : {}}
            data-value={value}
            id={id}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
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

function FormWarning({ warning }: IFormWarning): JSX.Element {
  return <p id='form-warning'>{warning}</p>;
}
