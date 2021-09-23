/* utility functions */

export function updateState<T extends { id: number | string }>(newItem: T, state: T[]): T[] {
  const id = state.findIndex(({ id }) => id === newItem.id);
  state[id] = newItem;
  return state;
}

export function removeFromState<T extends { id: number | string }>(removable: T, state: T[]): T[] {
  return (state = state.filter(({ id }) => id !== removable.id));
}
