export function formValidate(input: string, type: string) {
  switch (type) {
    case 'isEmail':
      return input.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi) !== null;
    case 'isPassword':
      return input.match(/^(?=.*[A-Za-z])[A-Za-z\d!]{6,}$/gi) !== null;
    case 'NoWhitespaces':
      return input.match(/^[^-\s][a-zA-Z0-9_\s-]+$/gi) !== null;
    default:
      console.log('Provide type of validation wanted');
  }
}

export function handleForm(nodelist: HTMLFormControlsCollection) {
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
        ? (e as HTMLInputElement).files![0].name
        : (e as HTMLInputElement).value,
    ]);
  return Object.fromEntries(list);
}
