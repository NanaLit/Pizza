import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const fetchPizza = createAsyncThunk('pizzas/fetchPizzas', async (params) => {
    const { sort, order, category, search, pagination } = params;
    const { data } = await axios.get(`https://65f82639b4f842e808870db2.mockapi.io/items?${pagination}&limit=4&${category}${search}&sortBy=${sort}&order=${order}`);
    return data
})

const initialState = {
    items: [],
    status: 'loading',
}

export const pizzasSlice = createSlice({
    name: 'pizzas',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchPizza.pending, (state, action) => {
            state.status = 'loading';
            state.items = [];
        });
        builder.addCase(fetchPizza.fulfilled, (state, action) => {
            state.items = action.payload;
            state.status = 'success';
        });
        builder.addCase(fetchPizza.rejected, (state, action) => {
            state.status ='error';
            state.items = [];
        });
    }
})


export default pizzasSlice.reducer;