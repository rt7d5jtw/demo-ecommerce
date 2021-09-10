import { CategoryDTO } from '../../category/categorySlice';

type FormObject = {
  [key: string]: string;
};

export function handleForm(nodelist: HTMLFormControlsCollection): FormObject {
  const list = Array.from(nodelist)
    .filter(
      (e) =>
        e.nodeName === 'INPUT' ||
        (e.nodeName === 'SELECT' && (e as HTMLSelectElement).multiple === false) ||
        e.nodeName === 'TEXTAREA'
    )
    .map((e) => [
      (e as HTMLInputElement).name,
      (e as HTMLInputElement).type === 'file'
        ? ((e as HTMLInputElement).files as FileList)[0].name
        : (e as HTMLInputElement).value,
    ]);
  return Object.fromEntries(list);
}

export function handleFormCategories(selectForm: HTMLSelectElement): CategoryDTO[] {
  return Array.from(selectForm.selectedOptions).map((optionEl) => ({ id: optionEl.value }));
}
