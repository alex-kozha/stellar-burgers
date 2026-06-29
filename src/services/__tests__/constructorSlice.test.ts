import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../slices/constructorSlice';
import { TIngredient } from '@utils-types';
import { TConstructorIngredient } from '../slices/constructorSlice';

const initialState = {
  bun: null,
  ingredients: []
};

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockIngredient1: TIngredient = {
  _id: 'ing-1',
  name: 'Котлета',
  type: 'main',
  proteins: 20,
  fat: 10,
  carbohydrates: 5,
  calories: 300,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockIngredient2: TIngredient = {
  _id: 'ing-2',
  name: 'Сыр',
  type: 'main',
  proteins: 15,
  fat: 8,
  carbohydrates: 3,
  calories: 250,
  price: 80,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('constructorSlice', () => {
  it('unknown', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('add bun', () => {
    const action = addIngredient(mockBun);
    const state = constructorReducer(initialState, action);
    const bun = state.bun as TConstructorIngredient;

    expect(state.bun).toMatchObject(mockBun);
    expect(bun?.constructorId).toBeDefined();
    expect(state.ingredients).toHaveLength(0);
  });

  it('add ingredient', () => {
    const action = addIngredient(mockIngredient1);
    const state = constructorReducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mockIngredient1);
    expect(state.ingredients[0].constructorId).toBeDefined();
  });

  test('remove ingredient', () => {
    let state = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );
    expect(state.ingredients).toHaveLength(1);

    state = constructorReducer(state, removeIngredient(0));
    expect(state.ingredients).toHaveLength(0);
  });

  test('move ingredient', () => {
    let state = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );
    state = constructorReducer(state, addIngredient(mockIngredient2));

    expect(state.ingredients[0]).toMatchObject(mockIngredient1);
    expect(state.ingredients[1]).toMatchObject(mockIngredient2);

    state = constructorReducer(state, moveIngredient({ from: 0, to: 1 }));

    expect(state.ingredients[0]).toMatchObject(mockIngredient2);
    expect(state.ingredients[1]).toMatchObject(mockIngredient1);
  });

  test('clear', () => {
    let state = constructorReducer(initialState, addIngredient(mockBun));
    state = constructorReducer(state, addIngredient(mockIngredient1));
    state = constructorReducer(state, addIngredient(mockIngredient2));
    const bun = state.bun as TConstructorIngredient;

    expect(state.bun).toMatchObject(mockBun);
    expect(bun?.constructorId).toBeDefined();
    expect(state.ingredients).toHaveLength(2);

    state = constructorReducer(state, clearConstructor());
    expect(state).toEqual(initialState);
  });
});
