import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  clearOrderByNumber
} from '../../services/slices/orderByNumberSlice';
import { TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const { order: orderData, isLoading } = useSelector(
    (state) => state.orderByNumber
  );
  const { ingredients } = useSelector((state) => state.ingredients);
  const dispatch = useDispatch();

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
    return () => {
      dispatch(clearOrderByNumber());
    };
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
