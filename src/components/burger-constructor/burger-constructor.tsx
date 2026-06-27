import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.burgerConstructor);
  const { isAuthenticated } = useSelector((state) => state.user);
  const {
    orderNumber,
    orderName,
    isLoading: orderRequest
  } = useSelector((state) => state.order);

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  const orderModalData: TOrder | null = useMemo(() => {
    if (!orderNumber) return null;

    return {
      _id: orderNumber.toString(), // или берем из ответа
      status: 'pending', // или 'done' из ответа
      name: orderName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ingredients: [], // массив ID ингредиентов
      number: orderNumber,
      price: price // цена заказа
    };
  }, [orderNumber, orderName, price]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (orderRequest) return;

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientsIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
