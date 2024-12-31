import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { repeatPayment } from '@/shared/store/orders/requests';

import { IOrdersHistory } from '@/shared/interfaces/order.interface';
import Button from '@/shared/components/ui/button';

import style from './style.module.scss';
import { message } from 'antd';
import { useRouter } from 'next/router';

interface IOrdersOrderCardProps extends IOrdersHistory {}

const OrdersOrderCard: FC<IOrdersOrderCardProps> = (props) => {
  const dispatch = useDispatch<TypeDispatch>();

  const router = useRouter();

  const classNameStatus: string = `${style.status} ${
    style[props.status_order.toLowerCase()]
  }`;

  const checkOrderStatus = (status: string) => {
    let color = '';
    let text = '';

    switch (status) {
      case 'NEWORDER':
        color = 'green';
        text = 'Нове замовлення';
        break;
      case 'WAITINGPAYMENT':
        color = 'orange';
        text = 'Очікується оплата';
        break;
      case 'PROGRESS':
        color = 'blue';
        text = 'Замовлення виконується';
        break;
      case 'DELIVERY':
        color = 'purple';
        text = 'Передано на доставку';
        break;
      case 'DELIVERED':
        color = 'gray';
        text = 'Доставлено';
        break;
      case 'CANCELED':
        color = 'default';
        text = 'Замовлення скасовано';
        break;
      default:
        color = 'default';
        text = 'Невідомо';
    }

    return { color, text };
  };

  console.log(props);

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

  const handleRepeat = async (id: number) => {
    try {
      await dispatch(repeatPayment(props.id));

      router.push('/profile/basket');
    } catch (err) {
      message.error('Что то пошло не так!');
    }
  };

  return (
    <article className={style.order}>
      <header className={style.header}>
        <h1 className={style.title}>
          <p>Замовлення №{props.id}</p> 
          {/* TODO  */}
        </h1>
        <p
          className={classNameStatus}
          style={{ color: `${checkOrderStatus(props.status_order).color}` }}
        >
          {checkOrderStatus(props.status_order).text}
        </p>
        <p className={style.date}>
          {new Date(props.createdAt * 1000).toLocaleDateString()}
        </p>{' '}
      </header>
      {props.status_order === 'WAITINGPAYMENT' ? (
        <p
          style={{ color: 'green', fontSize: '14px', cursor: 'pointer' }}
          onClick={() => window.open(`${props.payment_url}`, '_blank')}
        >
          Посилання для оплати
        </p>
      ) : (
        ''
      )}
      <div className={style.address}>
        <p className={style.label}>Адреса доставки</p>
        <p
          className={style.text}
        >{`${props.address}, кв. ${props.apartment}, під'їзд ${props.entrance}, поверх ${props.floor}`}</p>
      </div>
      <div className={style.images}>{imagesRendering}</div>
      <footer className={style.footer}>
        <h1 className={style.title}>Сума: {props.cost_order} грн</h1>
        <Button
          className={style.btn}
          basket
          onClick={() => handleRepeat(props.id)}
        >
          Повторити
        </Button>
      </footer>
    </article>
  );
};

export default OrdersOrderCard;
