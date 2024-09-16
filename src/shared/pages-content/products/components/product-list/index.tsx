import { FC } from 'react'

import IProduct from '@/shared/interfaces/product.interface'

import ProductList from '@/shared/components/product-list'
import Button from '@/shared/components/ui/button'

import style from './style.module.scss'

interface IProductsProductListProps {
  products: Array<IProduct>
}

const ProductsProductList: FC<IProductsProductListProps> = props => {
  return (
    <section className={style.products}>
      <ProductList products={props.products} />
      <Button className={style.view} view>
        Дивитися все
      </Button>
    </section>
  )
}

export default ProductsProductList
