import { FC } from 'react'
import Link from 'next/link'

import ArrowLeft from '@/shared/assets/icons/arrow-left-icon.svg'

import style from './style.module.scss'

interface IBreadcrumbBackProps {
  onClick: () => void;
}

const BreadcrumbBack: FC<IBreadcrumbBackProps> = ({ onClick }) => (
  <button className={style.back} onClick={onClick} type="button">
    <ArrowLeft className={style.icon} /> Назад
  </button>
)

export default BreadcrumbBack
