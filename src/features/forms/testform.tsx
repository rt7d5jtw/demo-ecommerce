import * as React from 'react';
import { ICategory } from '../category/categorySlice';
import './testform.css';

interface IFormWarning {
  orderIdentifier: number;
  warning: string;
}

interface ILabelForm {
  orderIdentifier: number;
  label: string;
  htmlFor?: string;
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
  onClickListener?: (e: MultipleSelectStateValues) => void;
  onStateListener?: (e: MultipleSelectState) => void;
  feedState?: ICategory[];
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

export function TestForm({
  fields,
  onSubmit,
  headlabel,
  submitlabel,
}: IProfileForm): JSX.Element {
  const parsed = parseFormJSON(fields);
  return (
    <form id='badumts-form' className='badumts-form' onSubmit={onSubmit}>
      <h1 id='badumts-form__headlabel'>{headlabel}</h1>
      {parsed.map((com) => {
        switch (com.component) {
          case 'input': {
            const comInput = com as FieldInputs;
            return (
              <InputForm
                orderIdentifier={comInput.orderIdentifier}
                name={comInput.name}
                id={comInput.id}
                step={comInput.step}
                placeholder={comInput.placeholder}
                defaultValue={comInput.defaultValue}
                value={comInput.value}
                title={comInput.title}
                type={comInput.type}
                required={comInput.required}
                onChange={comInput.onChange}
                key={comInput.orderIdentifier}
              />
            );
          }
          case 'labels': {
            const comLabel = com as ILabelForm;
            return (
              <LabelForm
                orderIdentifier={comLabel.orderIdentifier}
                htmlFor={comLabel.htmlFor}
                label={comLabel.label}
                key={comLabel.orderIdentifier}
              />
            );
          }
          case 'select': {
            const comSelect = com as FieldSelect;
            return (
              <SelectForm
                orderIdentifier={comSelect.orderIdentifier}
                form={comSelect.form}
                id={comSelect.id}
                name={comSelect.name}
                multiple={comSelect.multiple}
                options={comSelect.options}
                onChange={comSelect.onChange}
                key={comSelect.orderIdentifier}
              />
            );
          }
          case 'multiselect': {
            const comMultiselect = com as MultipleFieldSelect;
            return (
              <MultipleSelectForm
                orderIdentifier={comMultiselect.orderIdentifier}
                key={comMultiselect.orderIdentifier}
                form={comMultiselect.form}
                id={comMultiselect.id}
                name={comMultiselect.name}
                options={comMultiselect.options}
                onChange={comMultiselect.onChange}
                required={comMultiselect.required}
                label={comMultiselect.label}
                onClickListener={comMultiselect.onClickListener}
                onStateListener={comMultiselect.onStateListener}
                feedState={comMultiselect.feedState}
              />
            );
          }
          case 'textarea': {
            const comTextarea = com as FieldTextarea;
            return (
              <TextareaForm
                orderIdentifier={comTextarea.orderIdentifier}
                key={comTextarea.orderIdentifier}
                form={comTextarea.form}
                name={comTextarea.name}
                id={comTextarea.id}
                placeholder={comTextarea.placeholder}
                defaultValue={comTextarea.defaultValue}
                rows={comTextarea.rows}
                cols={comTextarea.cols}
                onChange={comTextarea.onChange}
              />
            );
          }
          case 'warning': {
            const comWarning = com as IFormWarning;
            return (
              <FormWarning
                warning={comWarning.warning}
                orderIdentifier={comWarning.orderIdentifier}
                key={comWarning.orderIdentifier}
              />
            );
          }
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

//type ComponentKey = 'labels' | 'input' | 'select' | 'multiselect' | 'textarea' | 'warning';

type FieldTypeArrayJSON = {
  [key: string]: FormComponent[];
};

type FormComponent =
  | ILabelForm
  | FieldInputs
  | FieldSelect
  | MultipleFieldSelect
  | FieldTextarea
  | IFormWarning;

type FormComponentNewMember<T> = T & {
  component: string;
  orderIdentifier: number;
};

function sortByOI<T extends { orderIdentifier: number }>(a: T, b: T): number {
  if (a.orderIdentifier > b.orderIdentifier) return 1;
  if (a.orderIdentifier < b.orderIdentifier) return -1;
  return 0;
}

export function parseFormJSON<Fields extends FieldTypeArrayJSON>(
  fields: Fields
): FormComponentNewMember<FormComponent>[] {
  const storage: FormComponentNewMember<FormComponent>[] = [];
  for (const i in fields) {
    fields[i].forEach(function (com: FormComponent) {
      storage.push({
        ...com,
        component: i,
      } as FormComponentNewMember<FormComponent>);
    });
  }
  return storage.sort(sortByOI);
}

function LabelForm({ label, htmlFor }: ILabelForm): JSX.Element {
  return <label htmlFor={htmlFor}>{label}</label>;
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
      key={id}
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

function SelectForm({
  form,
  name,
  id,
  multiple,
  options,
  onChange,
}: FieldSelect): JSX.Element {
  return (
    <select
      multiple={multiple}
      form={form}
      name={name}
      id={id}
      onChange={onChange}
    >
      {options.map(({ id, label, value }) => (
        <option value={value} key={id}>
          {label}
        </option>
      ))}
    </select>
  );
}

export type MultipleSelectState = {
  open: boolean;
  values: MultipleSelectStateValues[];
};

export type MultipleSelectStateValues = {
  id: string;
  name: string;
  index: number;
};

export function MultipleSelectForm({
  required,
  form,
  id,
  name,
  label,
  options,
  onClickListener,
  onStateListener,
  feedState,
}: MultipleFieldSelect): JSX.Element {
  type FormAction =
    | { type: 'open'; payload: boolean }
    | { type: 'values'; payload: MultipleSelectStateValues };
  function addToState(
    state: MultipleSelectStateValues[],
    item: MultipleSelectStateValues
  ): MultipleSelectStateValues[] {
    if (state.length === 0) {
      return [...state, item];
    }
    const existingItem = state.find((e) => item.id === e.id);
    if (existingItem) {
      return state.filter((e) => e.id !== item.id);
    }
    return [...state, { ...item }];
  }
  function formReducer(
    state: typeof initialState,
    action: FormAction
  ): MultipleSelectState {
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
  const initialState: MultipleSelectState = {
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

  /* Do not delete!
   * This is used make a copy out of selection options,
   * so that the clickHandler can ensure the selected item
   * exists in the selection options */
  const formStruct: Array<{ value: string; index: number }> = [];
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

  React.useEffect(() => {
    onStateListener && onStateListener(formState);
  }, [formState]);

  React.useEffect(() => {
    if (feedState) {
      initialStateHandler(feedState);
    }
  }, []);

  /* if initialState is provided */
  /* if initialState is provided, array of category ids is constructed
   * to see if the initialState has categories by comparing their values
   * to the HTMLOptionElements dataset values. If the values collide,
   * then selected property is flipped (to be selected) */
  function initialStateHandler(feedState: ICategory[]) {
    const matchArr = feedState.map(({ id }) => id);
    if (feedState.length >= 1 && kref.current) {
      Array.from(kref.current.options).forEach((e) => {
        if (
          matchArr.includes(e.value) &&
          e.dataset['id'] &&
          e.dataset['name']
        ) {
          e.selected = !e.selected;
          formDispatch({
            type: 'values',
            payload: {
              id: e.dataset['id'],
              index: e.index,
              name: e.dataset['name'],
            },
          });
        }
      });
    }
  }

  function clickHandler(
    event: React.MouseEvent<HTMLDivElement | HTMLOptionElement>
  ) {
    if (!Array.from(event.currentTarget.classList).includes('item')) {
      formDispatch({ type: 'open', payload: !formState.open });
    }

    /* flips the HTMLOptionElement's selected property by comparing it to the clicked HTMLDivElement
     * and also sets the index to keep the items sorted */
    if (kref.current && event.currentTarget.classList.contains('item')) {
      const refVal = { ...event.currentTarget.dataset };
      let oindex;
      Array.from(kref.current.options).forEach((e) => {
        if (e.dataset.id === refVal.id) {
          e.selected = !e.selected;
          oindex = e.index;
        }
      });

      if (refVal.name && refVal.id && oindex !== undefined) {
        onClickListener &&
          onClickListener({
            id: refVal['id'],
            index: oindex,
            name: refVal['name'],
          });
        formDispatch({
          type: 'values',
          payload: { id: refVal.id, index: oindex, name: refVal.name },
        });
      }
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
        ref={kref}
      >
        {options.map(({ id, label, value }) => (
          <option value={value} key={id} data-id={id} data-name={label}>
            {label}
          </option>
        ))}
      </select>
      <div
        ref={jref}
        className={formState.open ? 'multiple-ul--open' : 'multiple-ul--closed'}
      >
        {options.map(({ id, label }) => (
          <div
            key={id}
            onClick={(e) => clickHandler(e)}
            className={formState.open ? 'item li--open' : 'item li--closed'}
            style={
              formState.values.find((e) => e.id === id)
                ? { background: '#d3d3d3' }
                : {}
            }
            data-name={label}
            data-id={id}
            data-cy={`option-${label}`}
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
