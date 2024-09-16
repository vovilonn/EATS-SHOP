import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import style from './style.module.scss'

interface IBreadcrumbCategoryProps {
  name: string
  icon: string
  href: string
}

const BreadcrumbCategory: FC<IBreadcrumbCategoryProps> = props => (
  <Link className={style.category} href={props.href}>
    <span className={style.icon}>
      <Image width='30' height='24' src={props.icon} alt='category icon' />
    </span>
    {props.name}
  </Link>
)

export default BreadcrumbCategory
