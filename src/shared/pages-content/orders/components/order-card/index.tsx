import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { repeatPayment } from '@/shared/store/orders/requests';

import { IOrdersHistory } from '@/shared/interfaces/order.interface';
import Button from '@/shared/components/ui/button';

import style from './style.module.scss';

interface IOrdersOrderCardProps extends IOrdersHistory {}

const OrdersOrderCard: FC<IOrdersOrderCardProps> = (props) => {
  const dispatch = useDispatch<TypeDispatch>();

  const classNameStatus: string = `${style.status} ${
    style[props.status_order.toLowerCase()]
  }`;

  const imagesRendering = props.cart.cart_items.map((item) => {
    return (
      <div className={style.image} key={item.id}>
        <Image
          width="70"
          height="70"
          src={item.model_menu.picture[0]}
          alt={item.model_menu.name}
        />
      </div>
    );
  });

  return (
    <article className={style.order}>
      <header className={style.header}>
        <h1 className={style.title}>
          <Link href={`/profile/orders/${props.id}`}>Заказ №{props.id}</Link>
        </h1>
        <p className={classNameStatus}>{props.status_order}</p>
        <p className={style.date}>
          {new Date(props.createdAt * 1000).toLocaleDateString()}
        </p>{' '}
      </header>
      <div className={style.address}>
        <p className={style.label}>Адрес доставки</p>
        <p
          className={style.text}
        >{`${props.address}, кв. ${props.apartment}, подъезд ${props.entrance}, этаж ${props.floor}`}</p>
      </div>
      <div className={style.images}>{imagesRendering}</div>
      <footer className={style.footer}>
        <h1 className={style.title}>Сумма: {props.cost_order} грн</h1>
        <Button
          className={style.btn}
          basket
          onClick={() => dispatch(repeatPayment(props.id))}
        >
          Повторить
        </Button>
      </footer>
    </article>
  );
};

export default OrdersOrderCard;
