import { FC } from 'react'

import style from './style.module.scss'

interface IBreadcrumbNameProps {
  name: string
}

const BreadcrumbName: FC<IBreadcrumbNameProps> = props => (
  <p className={style.name}>{props.name}</p>
)

export default BreadcrumbName
