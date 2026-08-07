import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type PdfFormat = 'rollo' | 'carta';

const STORAGE_KEY = 'pdf_format';

function getStoredFormat(): PdfFormat {
  if (typeof window === 'undefined') return 'rollo';
  return (localStorage.getItem(STORAGE_KEY) as PdfFormat) ?? 'rollo';
}

export const printSlice = createSlice({
  name: 'print',
  initialState: {
    format: getStoredFormat() as PdfFormat,
  },
  reducers: {
    setFormat: (state, action: PayloadAction<PdfFormat>) => {
      state.format = action.payload;
      localStorage.setItem(STORAGE_KEY, action.payload);
    },
  },
});

export const { setFormat } = printSlice.actions;
