import {FC, useEffect, useMemo} from 'react';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

import { getCart } from '@/shared/store/cart/requests';

import ProductCard from '../product-card';
import EmptyCard from '../empty-card';

import IProduct from '@/shared/interfaces/product.interface';

import style from './style.module.scss';

interface IProductListProps {
  products: Array<IProduct>;
  basket?: boolean;
  minAmount?: number;
  toggleAmountFull?: boolean;
}

const ProductList: FC<IProductListProps> = (props) => {
  const dispatch = useDispatch<TypeDispatch>();
  const { cart_items } = useTypedSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  let productsRendering;

  if (props.basket) {
    productsRendering = cart_items.map((item) => {
      return (
        <ProductCard
          key={item.id}
          {...item.model_menu}
          cart_id={item.id}
          model_options={item.model_options}
          model_menu_ingredients_cart={item.model_menu_ingredients_cart}
          count={item.count}
          basket={props.basket}
          minAmount={props.minAmount}
          toggleAmountFull={props.toggleAmountFull}
        />
      );
    });
  } else {
    productsRendering = props.products.map((product) => {
      return (
        <ProductCard
          key={product.id}
          {...product}
          basket={props.basket}
          minAmount={props.minAmount}
          toggleAmountFull={props.toggleAmountFull}
        />
      );
    });
  }

  const content = useMemo(() => {
    if (productsRendering.length) {
      return productsRendering;
    }

    if (props.basket) {
      return (
        <EmptyCard
          title="Ваш корзина порожня 😯"
          text="Оберіть товар, щоб додати його в корзину"
        />
      );
    }

    return null;
  }, [productsRendering]);

  return (
    <div
      className={style.products}
      style={{
        gridTemplateColumns:
          productsRendering.length === 0 ? '1fr' : '1fr 1fr 1fr',
      }}
    >
      {content}
    </div>
  );
};

export default ProductList;
