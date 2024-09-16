import { ComponentType, FC } from 'react'

import style from './style.module.scss'

interface IBreadcrumbNameWithIconProps {
  name: string
  icon: ComponentType
}

const BreadcrumbNameWithIcon: FC<IBreadcrumbNameWithIconProps> = props => (
  <p className={style.name}>
    <props.icon />
    {props.name}
  </p>
)

export default BreadcrumbNameWithIcon
