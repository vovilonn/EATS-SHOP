import { FC, useState } from 'react'

import IProduct from '@/shared/interfaces/product.interface'

import ProductList from '@/shared/components/product-list'
import Button from '@/shared/components/ui/button'

import style from './style.module.scss'

interface IProductsProductListProps {
  products: Array<IProduct>
}

const ProductsProductList: FC<IProductsProductListProps> = ({ products }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Отображаем первые 6 продуктов, если список не раскрыт
  const displayedProducts = isExpanded ? products : products.slice(0, 6);

  return (
    <section className={style.products}>
      <ProductList products={displayedProducts} />
      {!isExpanded && (
        <Button
          className={style.view}
          view
          onClick={() => setIsExpanded(true)}
        >
          Дивитися все
        </Button>
      )}
    </section>
  )
}

export default ProductsProductList;
