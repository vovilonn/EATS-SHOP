import { FC } from 'react'
import Image from 'next/image'

import IOrder from '@/shared/interfaces/order.interface'

import Button from '@/shared/components/ui/button'

import style from './style.module.scss'
import Link from 'next/link'

interface IOrdersOrderCardProps extends IOrder {}

const OrdersOrderCard: FC<IOrdersOrderCardProps> = props => {
  const classNameStatus: string = `${style.status} ${style.create}`

  const imagesRendering = props.picture.map(image => {
    const key = Math.random()

    return (
      <div className={style.image} key={key}>
        <Image width='70' height='70' src={image} alt='product image' />
      </div>
    )
  })

  return (
    <article className={style.order}>
      <header className={style.header}>
        <h1 className={style.title}>
          <Link href={`/profile/orders/${props.id}`}>{props.title}</Link>
        </h1>
        <p className={classNameStatus}>{props.status}</p>
        <p className={style.date}>{props.date}</p>
      </header>
      <div className={style.address}>
        <p className={style.label}>Адреса доставки</p>
        <p className={style.text}>{props.address}</p>
      </div>
      <div className={style.images}>{imagesRendering}</div>
      <footer className={style.footer}>
        <h1 className={style.title}>Сума {props.price} грн</h1>
        <Button className={style.btn} basket>
          Повторити
        </Button>
      </footer>
    </article>
  )
}

export default OrdersOrderCard
