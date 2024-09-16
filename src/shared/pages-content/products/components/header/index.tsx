import { FC } from 'react'
import Image from 'next/image'

import ICategory from '@/shared/interfaces/category.interface'

import ProductsCategoryList from '../category-list'
import Title from '@/shared/components/title'

import style from './style.module.scss'
import CategoryList from '@/shared/components/category-list'

interface IProductsHeaderProps {
  category?: ICategory
  categories: ICategory[]
  brand?: { icon: string }
}

const ProductsHeader: FC<IProductsHeaderProps> = props => {
  return (
    <header className={ style.header }>
      { Boolean(props.brand?.icon.length) && (
        <span className={ style.brand }>
          <Image
            width='29'
            height='29'
            src={ String(props.brand?.icon) }
            alt='brand icon'
          />
        </span>
      ) }
      { !props.brand && (
        <Title icon={ props.category?.icon }>{ props.category?.name }</Title>
      ) }

      <div className={ style.categoriesList }>
        { !Boolean(Object.keys(props.category || {}).length) && (
          <ProductsCategoryList categories={ props.categories } />
        ) }
      </div>

      { Boolean(Object.keys(props.category || {}).length) && (
        <CategoryList categories={ props.categories } />
      ) }
    </header>
  )
}

export default ProductsHeader
