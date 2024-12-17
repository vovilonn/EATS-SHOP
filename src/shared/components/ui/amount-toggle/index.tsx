import { Dispatch, FC, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useActions } from '@/shared/hooks/use-actions';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

import { editCartCount } from '@/shared/store/cart/requests';

import MinusIcon from '@/shared/assets/icons/minus-icon.svg';
import PlusIcon from '@/shared/assets/icons/plus-icon.svg';

import style from './style.module.scss';

interface IAmountToggleProps {
  cartId?: number;
  ingredienId?: number;
  productId: number;
  setAmount: Dispatch<SetStateAction<number>>;
  amount: number;
  basket?: boolean;
  component?: boolean;
  full?: boolean;
  minAmount?: number;
}

const AmountToggle: FC<IAmountToggleProps> = (props) => {
  const dispatch = useDispatch<TypeDispatch>();
  const actions = useActions();
  const stateAuth = useTypedSelector((state) => state.auth);
  const classNameAmount = `
    ${style.amount}
    ${props.basket && style.basket}
    ${props.component && style.component}
  `;

  const onChangeAmount = (method: string) => {
    if (stateAuth.isAuth) {
      props.setAmount((prev) => {
        const calculateAmount = eval(`${prev} ${method} 1`);
  
        if (calculateAmount < (props.minAmount || 1)) {
          return prev; 
        }
  
        return calculateAmount;
      });
  
      if (props.basket) {
        if (method === '-' && props.amount === 1) {
          return;
        }

        actions.clearProductCount(props.productId);
        actions.clearProductIngredientsCount(props.productId);
        dispatch(
          editCartCount({
            id: props.cartId ?? 0,
            count: method === '+' ? props.amount + 1 : props.amount - 1,
          })
        );
      } else if (method === '+' && props.component) {
        actions.addProductIngredientsCount({
          product_id: props.productId,
          ingredients_id: props.ingredienId ?? 1,
          ingredients_count: props.amount,
        });
      } else if (method === '-' && props.component) {
        actions.removeProductIngredientsCount({
          product_id: props.productId,
          ingredients_id: props.ingredienId ?? 1,
        });
      } else if (method === '+' && !props.component && !props.basket) {
        actions.addProductCount(props.productId);
      } else if (method === '-' && !props.component && !props.basket) {
        actions.removeProductCount(props.productId);
      }
    } else {
      actions.setNeedAuth(true);
    }
  };

  return (
    <div className={classNameAmount}>
      {(Boolean(props.amount) || props.full) && (
        <>
          <button className={style.btn} onClick={() => onChangeAmount('-')}>
            <MinusIcon />
          </button>
          <p className={style.number}>{props.amount}</p>
        </>
      )}
      <button className={style.btn} onClick={() => onChangeAmount('+')}>
        <PlusIcon />
      </button>
    </div>
  );
};

export default AmountToggle;
