import { FC } from 'react'

import IProduct from '@/shared/interfaces/product.interface'

import Layout from '@/shared/layouts/default'
import ProductInfo from './components/info'
import ProductHeader from './components/header'
import ProductComponentList from './components/component-list'
import ICategory from "@/shared/interfaces/category.interface";

interface IProductPageContentProps {
  product: IProduct
}

const ProductPageContent: FC<IProductPageContentProps> = props => {
  return (
    <Layout>
      <ProductHeader category={props.product.model_general_categories as ICategory} productName={props.product.name} />
      <ProductInfo {...props.product} />
      <ProductComponentList
        components={props.product.model_additional_components}
      />
    </Layout>
  )
}

export default ProductPageContent
