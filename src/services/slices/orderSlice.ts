// services/slices/orderSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

interface IOrderState {
  orderNumber: number | null;
  orderName: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  orderNumber: null,
  orderName: '',
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientsId: string[]) => {
    const response = await orderBurgerApi(ingredientsId);
    return response;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderNumber = null;
      state.orderName = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload.order.number;
        state.orderName = action.payload.name;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
