import { configureStore } from '@reduxjs/toolkit';
import myAccountSlice from '../Slicers/myAccountSlice';
import subjectReducer from '../Slicers/subjectSlice';
import phaseReducer from '../Slicers/phaseSlice';
import categoryReducer from '../Slicers/categorySlice';

export const store = configureStore({
    reducer: {
        myAccount:myAccountSlice,
        subject:subjectReducer,
        phase:phaseReducer,
        category:categoryReducer,
    }
})


