import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentScenarioGroup: { name: "", id: "" },
    isLoading: false,
    error: false,
};

export const scenarioGroupSlice = createSlice({
    name: "scenarioGroup",
    initialState,
    reducers: {
        selectScenarioGroup: (state, action) => {
            state.isLoading = false;
            state.currentScenarioGroup = action.payload;
        },
    },
});

export const {
    selectScenarioGroup
} = scenarioGroupSlice.actions;

export default scenarioGroupSlice.reducer;
