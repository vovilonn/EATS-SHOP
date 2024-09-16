import { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import IProduct from '@/shared/interfaces/product.interface'
import ICategory from '@/shared/interfaces/category.interface'

import Axios from '@/shared/utils/axios.utility'

import ProductsPageContent from '@/shared/pages-content/products'

interface IProductsCategoryPageProps {
  products: IProduct[]
  categories: ICategory[]
  category: ICategory
}

const ProductsCategoryPage: NextPage<IProductsCategoryPageProps> = props => {
  return (
    <ProductsPageContent
      products={props.products}
      category={props.category}
      categories={props.categories}
    />
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = (
    await Axios({ method: 'get', url: '/menu/general_categories/view' })
  ).data

  const paths = categories.map((category: ICategory) => ({
    params: { id: String(category.id) },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async props => {
  const categoryId = props.params?.id

  const getProducts = Axios({
    method: 'get',
    url: `/menu/view?page=1&general_categories_id=${categoryId}`,
  })

  const getCategories = Axios({
    method: 'get',
    url: '/menu/general_categories/view',
  })

  const data = await Promise.all([getProducts, getCategories]).then(data => ({
    products: data[0].data,
    categories: data[1].data,
  }))

  const category = data.categories.find(
    (category: ICategory) => category.id === Number(categoryId)
  )

  return {
    props: { ...data, category },
    revalidate: 200,
  }
}

export default ProductsCategoryPage
