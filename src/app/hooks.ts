import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';

export const useAppDispatch = (): RootState => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
