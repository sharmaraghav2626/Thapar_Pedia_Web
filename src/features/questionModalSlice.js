import { createSlice } from '@reduxjs/toolkit'

const questionModalSlice = createSlice({
    name: 'questionModal',
    initialState:{
        IsquestionModal:null
    },
    reducers: {
        setQuestionModalTrue:(state,action)=>{
            state.IsquestionModal=true;
        },
        setQuestionModalFalse:(state,action)=>{
            state.IsquestionModal=false;
        }
    }
});
export const {setQuestionModalTrue,setQuestionModalFalse} = questionModalSlice.actions;
export const selectQuestionModal=(state) => state.questionModal.IsquestionModal;
export default questionModalSlice.reducer