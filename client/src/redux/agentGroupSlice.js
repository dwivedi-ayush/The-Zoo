import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentAgentGroup: { name: "Global Agent Group", id: "" },
    isLoading: false,
    error: false,
};

export const agentGroupSlice = createSlice({
    name: "agentGroup",
    initialState,
    reducers: {
        selectAgentGroup: (state, action) => {
            state.isLoading = false;
            state.currentAgentGroup = action.payload;
        },
    },
});

export const {
    selectAgentGroup
} = agentGroupSlice.actions;

export default agentGroupSlice.reducer;
