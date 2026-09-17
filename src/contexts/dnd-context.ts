import { createContext, useContext } from 'react';

export type TDndContext = {
  draggingType: string | null;
  setDraggingType: (type: string | null) => void;
};

export const initialState: TDndContext = {
  draggingType: null,
  setDraggingType: (): void => undefined,
};

export const DndContext = createContext<TDndContext>(initialState);

export const useDndContext = (): TDndContext => useContext(DndContext);
