import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

import AmountToggle from '../ui/amount-toggle';

import IComponent from '@/shared/interfaces/component.interface';

import style from './style.module.scss';

interface IComponentCardProps extends IComponent {}

const ComponentCard: FC<IComponentCardProps> = (props) => {
  const router = useRouter();
  const { id } = router.query;

  const ingredient = useTypedSelector((state) =>
    state.product.productIngredientsCount
      .find((item) => item.product_id === Number(id))
      ?.ingredients.find(
        (ingredient) => ingredient.menu_ingredients_id === props.id
      )
  );

  const [amount, setAmount] = useState<number>(
    ingredient ? ingredient.count : 0
  );

  const [classNameComponent, setClassNameComponent] = useState<string>(`
    ${style.component}
  `);

  useEffect(() => {
    if (!ingredient?.count) {
      setAmount(0);
    } else {
      setAmount(ingredient.count);
    }
  }, []);

  useEffect(() => {
    setClassNameComponent(`
      ${style.component}
      ${amount >= 1 && style.selected}
    `);
  }, [amount]);

  return (
    <article className={classNameComponent}>
      <header
        className={style.header}
        style={{ backgroundImage: `url(${props.picture})` }}
      />
      <h1 className={style.title}>{props.name}</h1>
      <p className={style.text}>
        {props.options} - <span>{props.price} грн</span>
      </p>
      <footer className={style.footer}>
        <AmountToggle
          ingredienId={props.id}
          productId={Number(id) ?? 1}
          setAmount={setAmount}
          amount={amount}
          minAmount={0}
          component
          full
        />
      </footer>
    </article>
  );
};

export default ComponentCard;
