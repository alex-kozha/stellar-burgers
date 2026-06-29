import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlices';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.feeds);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
