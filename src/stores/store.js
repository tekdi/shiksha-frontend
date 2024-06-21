"use client";

import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(persist((set) => ({
value: '',
isFromDate: '',
isToDate:'',
setFromDate: (newFromDate) => set((state) => ({ isFromDate: newFromDate })),
setToDate: (newToDate) => set((state) => ({ isToDate: newToDate })),
}), {
name: 'teacherZustand',
getStorage: () => localStorage,
}));

export default useStore ;