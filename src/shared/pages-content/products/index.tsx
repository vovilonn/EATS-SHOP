import { FC } from 'react'

import IProduct from '@/shared/interfaces/product.interface'
import ICategory from '@/shared/interfaces/category.interface'

import Layout from '@/shared/layouts/default'
import ProductsProductList from './components/product-list'
import ProductsHeader from './components/header'

interface IProductsPageContentProps {
  products: IProduct[]
  categories: ICategory[]
  category?: ICategory
  brand?: { icon: string }
}

const ProductsPageContent: FC<IProductsPageContentProps> = props => {
  return (
    <Layout>
      {Boolean(props.products.length) && (
        <>
          <ProductsHeader
            category={props.category}
            categories={props.categories}
            brand={props.brand}
          />
          <ProductsProductList products={props.products} />
        </>
      )}
    </Layout>
  )
}

export default ProductsPageContent
