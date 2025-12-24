import { create } from "zustand";

export interface UiState {
  isLoading: boolean;
  setIsLoading: (bool: boolean) => void;
}

export const useUiState = create<UiState>((set, get) => ({
  isLoading: true,
  setIsLoading: (bool: boolean) => {
    set({
      isLoading: bool,
    });
  },

}));