import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cartData: [],
    totalQuantity: 0,
    totalAmount: 0,
}

const addToCartSlice = createSlice({
    name: "cartinfo",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            console.log(newItem, 'newItem')
            
            // Check if item already exists in cart
            const existingItem = state.cartData.find(item => item.id === newItem.id);
            
            if (existingItem) {
                // If item exists, increase quantity
                existingItem.quantity += newItem.quantity || 1;
            } else {
                // If item doesn't exist, add it to cart with all product info
                state.cartData.push({
                    ...newItem, // This spreads all the product properties
                    quantity: newItem.quantity || 1,
                    // You can also add cart-specific properties if needed
                    addedAt: new Date().toISOString()
                });
            }
            
            // Recalculate totals
            state.totalQuantity = state.cartData.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.cartData.reduce((total, item) => total + (item.list_price * item.quantity), 0);
        },
        
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.cartData = state.cartData.filter((item) => item.id !== id);
            
            // Recalculate totals after removal
            state.totalQuantity = state.cartData.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.cartData.reduce((total, item) => total + (item.list_price * item.quantity), 0);
        },
        
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartData.find(item => item.id === id);
            
            if (item && quantity > 0) {
                item.quantity = quantity;
                
                // Recalculate totals
                state.totalQuantity = state.cartData.reduce((total, item) => total + item.quantity, 0);
                state.totalAmount = state.cartData.reduce((total, item) => total + (item.list_price * item.quantity), 0);
            }
        },
        
        incrementQuantity: (state, action) => {
            const id = action.payload;
            const item = state.cartData.find(item => item.id === id);
            
            if (item) {
                item.quantity += 1;
                
                // Recalculate totals
                state.totalQuantity = state.cartData.reduce((total, item) => total + item.quantity, 0);
                state.totalAmount = state.cartData.reduce((total, item) => total + (item.list_price * item.quantity), 0);
            }
        },
        
        decrementQuantity: (state, action) => {
            const id = action.payload;
            const item = state.cartData.find(item => item.id === id);
            
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    // Remove item if quantity becomes 0
                    state.cartData = state.cartData.filter(item => item.id !== id);
                }
                
                // Recalculate totals
                state.totalQuantity = state.cartData.reduce((total, item) => total + item.quantity, 0);
                state.totalAmount = state.cartData.reduce((total, item) => total + (item.list_price * item.quantity), 0);
            }
        },
        
        clearCart: (state) => {
            state.cartData = [];
            state.totalAmount = 0;
            state.totalQuantity = 0;
        },
    }
})

export const { 
    addToCart, 
    removeFromCart, 
    clearCart, 
    updateQuantity, 
    incrementQuantity, 
    decrementQuantity 
} = addToCartSlice.actions;

export default addToCartSlice.reducer;