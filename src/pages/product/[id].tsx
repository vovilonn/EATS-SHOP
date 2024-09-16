import IProduct from '@/shared/interfaces/product.interface'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import ProductPageContent from '@/shared/pages-content/product'

import Axios from '@/shared/utils/axios.utility'

interface IProductPageProps {
  product: IProduct
}

const ProductPage: NextPage<IProductPageProps> = props => {
  return <ProductPageContent product={props.product} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products = (await Axios({ method: 'get', url: '/menu/view' })).data

  const paths = products.map((product: IProduct) => ({
    params: { id: String(product.id) },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async props => {
  const productId = props.params?.id

  const product = (
    await Axios({
      method: 'get',
      url: `/menu/view?menu_id=${productId}`,
    })
  ).data

  return {
    props: { product: product[0] },
    revalidate: 200,
  }
}

export default ProductPage
