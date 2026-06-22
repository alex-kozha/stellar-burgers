import {
  ConstructorPage,
  Profile,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  ProfileOrders,
  Feed,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUser } from '../../services/slices/userSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { OrderInfo } from '@components';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppHeader } from '@components';
import { Preloader } from '@ui';
import { Modal } from '../modal/index';
import { IngredientDetails } from '../ingredient-details/index';
import { useNavigate, useParams } from 'react-router-dom';
import { ProtectedRoute } from '../../components/protected-route';

const OrderModal = () => {
  const navigate = useNavigate();

  return (
    <Modal title='Детали заказа' onClose={() => navigate(-1)}>
      <OrderInfo />
    </Modal>
  );
};

// Компонент-обёртка для модалки ингредиента
const IngredientModal = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
      <IngredientDetails />
    </Modal>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <ConstructorPage />
  },
  {
    path: '/feed',
    element: <Feed />
  },
  {
    path: '/feed/:number',
    element: <OrderModal />
  },
  {
    path: '/ingredients/:id',
    element: <IngredientModal />
  },
  {
    path: '/login',
    element: (
      <ProtectedRoute onlyUnAuth>
        <Login />
      </ProtectedRoute>
    )
  },
  {
    path: '/register',
    element: (
      <ProtectedRoute onlyUnAuth>
        <Register />
      </ProtectedRoute>
    )
  },
  {
    path: '/forgot-password',
    element: (
      <ProtectedRoute onlyUnAuth>
        <ForgotPassword />
      </ProtectedRoute>
    )
  },
  {
    path: '/reset-password',
    element: (
      <ProtectedRoute onlyUnAuth>
        <ResetPassword />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile/orders',
    element: (
      <ProtectedRoute>
        <ProfileOrders />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile/orders/:number',
    element: <OrderModal />
  },
  {
    path: '*',
    element: <NotFound404 />
  }
]);

const App = () => {
  const dispatch = useDispatch();

  const {
    ingredients: ingredientsData,
    isLoading: isIngredientsLoading,
    error
  } = useSelector((state) => state.ingredients);
  const { isAuthenticated, isLoading: isUserLoading } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!ingredientsData.length && !isIngredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientsData.length, isIngredientsLoading]);

  useEffect(() => {
    if (!isAuthenticated && !isUserLoading) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated, isUserLoading]);

  if (isIngredientsLoading || isUserLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      {ingredientsData.length > 0 ? (
        <RouterProvider router={router} />
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет ингредиентов
        </div>
      )}
    </div>
  );
};

export default App;
