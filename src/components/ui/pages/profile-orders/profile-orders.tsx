import { FC } from 'react';

import styles from './profile-orders.module.css';

import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => {
  console.log('🔍🔍🔍 ProfileOrdersUI: orders =', orders);
  console.log('🔍🔍🔍 ProfileOrdersUI: количество заказов =', orders?.length);

  if (!orders || orders.length === 0) {
    return <div>У вас пока нет заказов</div>;
  }

  return (
    <main className={styles.main}>
      <div className={`mt-30 mr-15 ${styles.menu}`}>
        <ProfileMenu />
      </div>
      <div className={`mt-10 ${styles.orders}`}>
        <OrdersList orders={orders} />
      </div>
    </main>
  );
};
