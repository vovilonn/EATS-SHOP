import { FC } from 'react'

import ProductCard from '../product-card'

import IProduct from '@/shared/interfaces/product.interface'

import style from './style.module.scss'

interface IProductListProps {
  products: Array<IProduct>
  basket?: boolean
  minAmount?: number
  toggleAmountFull?: boolean
}

const ProductList: FC<IProductListProps> = props => {
  const productsRendering = props.products.map(product => {
    return (
      <ProductCard
        key={product.id}
        {...product}
        basket={props.basket}
        minAmount={props.minAmount}
        toggleAmountFull={props.toggleAmountFull}
      />
    )
  })

  return <div className={style.products}>{productsRendering}</div>
}

export default ProductList
