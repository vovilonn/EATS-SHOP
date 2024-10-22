import IProduct from '@/shared/interfaces/product.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchSearchProducts } from './requests';

interface IProductsCount {
  product_id: number;
  product_count: number;
}

interface IProductIngredient {
  menu_ingredients_id: number;
  count: number;
}

interface IProductIngredientsCount {
  product_id: number;
  ingredients: IProductIngredient[];
}

interface IProductInitialState {
  productsCount: IProductsCount[];
  productIngredientsCount: IProductIngredientsCount[];
  searchQuery: string;
  searchResults: IProduct[];
}

const initialState: IProductInitialState = {
  productsCount: [],
  productIngredientsCount: [],
  searchQuery: '',
  searchResults: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearProductCount: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.productsCount = state.productsCount.filter(
        (item) => item.product_id !== productId
      );
    },
    addProductCount: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const existingProductCount = state.productsCount.find(
        (item) => item.product_id === productId
      );

      if (existingProductCount) {
        existingProductCount.product_count += 1;
      } else {
        state.productsCount.push({
          product_id: productId,
          product_count: 1,
        });
      }
    },
    removeProductCount: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const existingProductCount = state.productsCount.find(
        (item) => item.product_id === productId
      );

      if (existingProductCount && existingProductCount.product_count > 0) {
        existingProductCount.product_count -= 1;
      }
    },
    clearProductIngredientsCount: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.productIngredientsCount = state.productIngredientsCount.filter(
        (item) => item.product_id !== productId
      );
    },
    addProductIngredientsCount: (
      state,
      action: PayloadAction<{
        product_id: number;
        ingredients_id: number;
        ingredients_count: number;
      }>
    ) => {
      const { product_id, ingredients_id, ingredients_count } = action.payload;

      const existingProductIngredient = state.productIngredientsCount.find(
        (item) => item.product_id === product_id
      );

      if (existingProductIngredient) {
        const existingIngredient = existingProductIngredient.ingredients.find(
          (item) => item.menu_ingredients_id === ingredients_id
        );

        if (existingIngredient) {
          existingIngredient.count += ingredients_count;
        } else {
          existingProductIngredient.ingredients.push({
            menu_ingredients_id: ingredients_id,
            count: 1,
          });
        }
      } else {
        state.productIngredientsCount.push({
          product_id,
          ingredients: [
            {
              menu_ingredients_id: ingredients_id,
              count: 1,
            },
          ],
        });
      }
    },
    removeProductIngredientsCount: (
      state,
      action: PayloadAction<{ product_id: number; ingredients_id: number }>
    ) => {
      const { product_id, ingredients_id } = action.payload;

      const existingProductIngredient = state.productIngredientsCount.find(
        (item) => item.product_id === product_id
      );

      if (existingProductIngredient) {
        const existingIngredient = existingProductIngredient.ingredients.find(
          (item) => item.menu_ingredients_id === ingredients_id
        );

        if (existingIngredient && existingIngredient.count > 0) {
          existingIngredient.count -= 1;
        }

        if (existingIngredient?.count === 0) {
          existingProductIngredient.ingredients =
            existingProductIngredient.ingredients.filter(
              (item) => item.menu_ingredients_id !== ingredients_id
            );
        }
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchSearchProducts.fulfilled, (state, action) => {
      state.searchResults = action.payload;
    });
  },
});

export default productSlice;
