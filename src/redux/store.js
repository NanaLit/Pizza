import { configureStore } from "@reduxjs/toolkit";
import filterReduser from "./slices/filterSlice";
import cartReduser from "./slices/cartSlice";
import pizzasReduser from "./slices/pizzasSlice";

export const store = configureStore({
    reducer: {
        filter: filterReduser,
        cart: cartReduser,
        pizzas: pizzasReduser
    },
})