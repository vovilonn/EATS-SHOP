import { FC } from 'react'

import IProduct from '@/shared/interfaces/product.interface'

import Layout from '@/shared/layouts/default'
import ProductInfo from './components/info'
import ProductHeader from './components/header'
import ProductComponentList from './components/component-list'

interface IProductPageContentProps {
  product: IProduct
}

const ProductPageContent: FC<IProductPageContentProps> = props => {
  return (
    <Layout>
      <ProductHeader />
      <ProductInfo {...props.product} />
      <ProductComponentList
        components={props.product.model_additional_components}
      />
    </Layout>
  )
}

export default ProductPageContent
