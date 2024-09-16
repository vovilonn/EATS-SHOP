import { GetStaticProps, NextPage } from 'next'

import IBrand from '@/shared/interfaces/brand.interface'
import ICategory from '@/shared/interfaces/category.interface'

import Axios from '@/shared/utils/axios.utility'

import HomePageContent from '@/shared/pages-content/home'

interface IHomePageProps {
  brands: IBrand[]
  categories: ICategory[]
}

const HomePage: NextPage<IHomePageProps> = props => {
  return <HomePageContent brands={props.brands} categories={props.categories} />
}

export const getStaticProps: GetStaticProps = async () => {
  const getBrands = Axios({ method: 'get', url: '/menu/branded_store/view' })

  const getCategories = Axios({
    method: 'get',
    url: '/menu/general_categories/view',
  })

  const data = await Promise.all([getBrands, getCategories]).then(data => ({
    brands: data[0].data,
    categories: data[1].data,
  }))

  return {
    props: { ...data },
    revalidate: 200,
  }
}

export default HomePage
