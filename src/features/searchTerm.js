import { createSlice } from '@reduxjs/toolkit'

const searchTerm = createSlice({
    name: 'searchTerm',
    initialState:{
        search:""
    },
    reducers: {
        setsearchTerm:(state,action)=>{
            state.search=action.payload;
        },
    }
});
export const {setsearchTerm} = searchTerm.actions;
export const search=(state) => state.searchTerm.search;
export default searchTerm.reducer