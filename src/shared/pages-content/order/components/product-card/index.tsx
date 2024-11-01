import { FC } from 'react';
import Image from 'next/image';

import IProduct from '@/shared/interfaces/product.interface';

import style from './style.module.scss';

// interface IOrderProductCardProps extends IProduct {}

const OrderProductCard: FC = () => {
  return (
    <article className={style.card}>
      <Image
        className={style.image}
        width="88"
        height="88"
        src="https://s3.eu-north-1.amazonaws.com/eats.app/menu/menu_pizza.png"
        alt="product image"
      />
      <h1 className={style.title}>Італійська вегетаріана</h1>
      <p className={style.composition}>
        <b>Склад: </b> соус бешамель, сир моцарела, хрусткий салат, куряче
        м'ясо, перепелині яйця, помідори, соус "Цезар" (містить часник),
        пармезан
      </p>
      <p className={style.option}>30 см</p>
      <p className={style.price}>190 грн - (1 шт)</p>
      <div className={style.ingredients}>
        <p className={style.label}>Додаткові інгредієнти:</p>
        <p className={style.text}>Сир моцарела (50 г - 23 грн)</p>
      </div>
    </article>
  );
};

export default OrderProductCard;
