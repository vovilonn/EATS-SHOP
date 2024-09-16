import { ComponentType, FC } from 'react'
import Link from 'next/link'

import style from './style.module.scss'

interface IBreadcrumbGeneralProps {
  name: string
  icon: ComponentType
  href: string
}

const BreadcrumbGeneral: FC<IBreadcrumbGeneralProps> = props => (
  <Link className={style.general} href={props.href}>
    <props.icon /> {props.name}
  </Link>
)

export default BreadcrumbGeneral
