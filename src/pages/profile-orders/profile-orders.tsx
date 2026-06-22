import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/feedSlices';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('🔥🔥🔥 ProfileOrders: useEffect ВЫЗВАН!');
    dispatch(fetchUserOrders());
  }, [dispatch]);
  const { orders, isLoading } = useSelector((state) => state.feeds);
  console.log('🔥 ProfileOrders: orders =', orders); // ← должен быть Array(12)

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
