import { FC } from 'react';

import styles from './profile-orders.module.css';

import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => (
  <main className={styles.main}>
    {/* ✅ Меню всегда видно */}
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>

    {/* ✅ Контент: либо заказы, либо сообщение */}
    <div className={`mt-10 ${styles.orders}`}>
      {!orders || orders.length === 0 ? (
        <div className='text text_type_main-medium text_color_inactive'>
          У вас пока нет заказов
        </div>
      ) : (
        <OrdersList orders={orders} />
      )}
    </div>
  </main>
);
