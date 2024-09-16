import { FC, useEffect, useState } from 'react'

import IComponent from '@/shared/interfaces/component.interface'

import AmountToggle from '../ui/amount-toggle'

import style from './style.module.scss'

interface IComponentCardProps extends IComponent {}

const ComponentCard: FC<IComponentCardProps> = props => {
  const [amount, setAmount] = useState<number>(0)
  const [classNameComponent, setClassNameComponent] = useState<string>(`
    ${style.component}
  `)

  useEffect(() => {
    setClassNameComponent(`
      ${style.component}
      ${amount >= 1 && style.selected}
    `)
  }, [amount])

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
        <AmountToggle setAmount={setAmount} amount={amount} component full />
      </footer>
    </article>
  )
}

export default ComponentCard
