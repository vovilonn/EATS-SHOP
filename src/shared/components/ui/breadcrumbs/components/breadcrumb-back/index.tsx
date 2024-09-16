import { FC } from 'react'
import Link from 'next/link'

import ArrowLeft from '@/shared/assets/icons/arrow-left-icon.svg'

import style from './style.module.scss'

interface IBreadcrumbBackProps {
  href: string
}

const BreadcrumbBack: FC<IBreadcrumbBackProps> = props => (
  <Link className={style.back} href={props.href}>
    <ArrowLeft className={style.icon} /> Назад
  </Link>
)

export default BreadcrumbBack
