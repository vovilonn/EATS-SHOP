import { FC } from 'react'

import style from './style.module.scss'

interface IInstitutionProps {
  selected?: boolean
}

const Institution: FC<IInstitutionProps> = props => {
  const className: string = `
    ${style.institution}
    ${props.selected && style.selected}
  `

  return (
    <article className={className}>
      <h1 className={style.title}>Назва закладу</h1>
      <h2 className={style.title}>Адреса закладу</h2>
      <h3 className={style.title}>Графік роботи:</h3>
      <div className={style.schedule}>
        <p className={style.text}>Пн-Чт: 10:00 - 23:00</p>
        <p className={style.text}>Чт-Сб: 12:00 - 23:00</p>
        <p className={style.text}>Вс: 14:00 - 23:00</p>
      </div>
    </article>
  )
}

export default Institution
