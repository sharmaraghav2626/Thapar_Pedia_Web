import { createSlice } from '@reduxjs/toolkit'

const navBarSlice = createSlice({
    name: 'navBarType',
    initialState:{
        type:'home'
    },
    reducers: {
        setNavBarState:(state,action)=>{
            state.type=action.payload
        }
    }
});
export const {setNavBarState} = navBarSlice.actions;
export const selectNavbarState=(state) => state.navBarType.type;
export default navBarSlice.reducer