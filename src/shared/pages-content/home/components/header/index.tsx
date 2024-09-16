import { FC } from 'react'

import ICategory from '@/shared/interfaces/category.interface'

import CategoryList from '../../../../components/category-list'

import style from './style.module.scss'

interface IHomeHeaderProps {
  categories: ICategory[]
}

const HomeHeader: FC<IHomeHeaderProps> = props => {
  return (
    <header className={style.header}>
      <CategoryList categories={props.categories} />
    </header>
  )
}

export default HomeHeader
