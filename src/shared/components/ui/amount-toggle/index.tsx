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
  minAmount?: number; // Минимальное количество, по умолчанию 1
}

const AmountToggle: FC<IAmountToggleProps> = (props) => {
  const dispatch = useDispatch<TypeDispatch>();
  const actions = useActions();
  const stateAuth = useTypedSelector((state) => state.auth);

  // Классы для стилизации
  const classNameAmount = `
    ${style.amount}
    ${props.basket && style.basket}
    ${props.component && style.component}
  `;

  const onChangeAmount = async (method: string) => {
    // 1) Проверяем авторизацию
    if (!stateAuth.isAuth) {
      actions.setNeedAuth(true);
      return;
    }

    // 2) Следим, чтобы при уменьшении количество не стало меньше props.minAmount (по умолчанию = 1)
    props.setAmount((prev) => {
      const newAmount = method === '+' ? prev + 1 : prev - 1;
      const min = props.minAmount ?? 1;
      // Если результат ниже минимального значения, возвращаем min
      if (newAmount < min) {
        return min;
      }
      return newAmount;
    });

    // 3) Обновляем данные в корзине или в Redux, если это нужно
    if (props.basket) {
      // Если в корзине пытаемся уменьшить товар с количеством = 1, ничего не делаем
      if (method === '-' && props.amount === 1) {
        return;
      }

      actions.clearProductCount(props.productId);
      actions.clearProductIngredientsCount(props.productId);

      // Обращаемся к API, чтобы изменить количество товара в корзине
      await dispatch(
        editCartCount({
          id: props.cartId ?? 0,
          count: method === '+' ? props.amount + 1 : props.amount - 1,
        })
      );
    } else if (method === '+' && props.component) {
      // Логика увеличения «доп. ингредиента»
      actions.addProductIngredientsCount({
        product_id: props.productId,
        ingredients_id: props.ingredienId ?? 1,
        ingredients_count: props.amount === 0 ? 1 : props.amount,
      });
    } else if (method === '-' && props.component) {
      // Логика уменьшения «доп. ингредиента»
      actions.removeProductIngredientsCount({
        product_id: props.productId,
        ingredients_id: props.ingredienId ?? 1,
      });
    } else if (method === '+' && !props.component && !props.basket) {
      // Логика увеличения количества товара (не в корзине, а где-то на этапе выбора)
      actions.addProductCount(props.productId);
    } else if (method === '-' && !props.component && !props.basket) {
      // Логика уменьшения количества товара (не в корзине)
      actions.removeProductCount(props.productId);
    }
  };

  return (
    <div className={classNameAmount}>
      {/* Если amount > 0 или указан флаг full, отображаем блок с числом и кнопкой "-" */}
      {(Boolean(props.amount) || props.full) && (
        <>
          <button className={style.btn} onClick={() => onChangeAmount('-')}>
            <MinusIcon />
          </button>
          <p className={style.number}>{props.amount}</p>
        </>
      )}

      {/* Кнопка "+" */}
      <button className={style.btn} onClick={() => onChangeAmount('+')}>
        <PlusIcon />
      </button>
    </div>
  );
};

export default AmountToggle;
