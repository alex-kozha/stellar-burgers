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
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUser } from '../../services/slices/userSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { OrderInfo } from '@components';
import { AppHeader } from '@components';
import { Preloader } from '@ui';
import { Modal } from '../modal/index';
import { IngredientDetails } from '../ingredient-details/index';
import {
  useNavigate,
  useParams,
  useLocation,
  Routes,
  Route
} from 'react-router-dom';
import { ProtectedRoute } from '../../components/protected-route';

const OrderModal = () => {
  const navigate = useNavigate();
  return (
    <Modal title='Детали заказа' onClose={() => navigate(-1)}>
      <OrderInfo />
    </Modal>
  );
};

const IngredientModal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
      <IngredientDetails />
    </Modal>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const background = location.state?.background;
  const hasChecked = useRef(false);

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
    if (!hasChecked.current) {
      hasChecked.current = true;
      dispatch(fetchUser());
    }
  }, [dispatch]);

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
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      {ingredientsData.length > 0 ? (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />

            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {background && (
            <Routes>
              <Route path='/feed/:number' element={<OrderModal />} />
              <Route path='/ingredients/:id' element={<IngredientModal />} />
              <Route path='/profile/orders/:number' element={<OrderModal />} />
            </Routes>
          )}
        </>
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет ингредиентов
        </div>
      )}
    </div>
  );
};

export default App;
