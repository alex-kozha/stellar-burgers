import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUser, updateUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!user) return;

    const updatedData: { name?: string; email?: string; password?: string } =
      {};
    if (formValue.name !== user.name) updatedData.name = formValue.name;
    if (formValue.email !== user.email) updatedData.email = formValue.email;
    if (formValue.password) updatedData.password = formValue.password;

    if (Object.keys(updatedData).length === 0) return;

    dispatch(updateUser(updatedData))
      .unwrap()
      .then(() => {})
      .catch(() => {});
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
