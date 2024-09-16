import { FC } from 'react'

import IBrand from '@/shared/interfaces/brand.interface'
import ICategory from '@/shared/interfaces/category.interface'

import Layout from '@/shared/layouts/default'

import HomeHeader from './components/header'
import HomeBrandList from './components/brand-list'

interface IHomePageContentProps {
  brands: IBrand[]
  categories: ICategory[]
}

const HomePageContent: FC<IHomePageContentProps> = props => {
  return (
    <Layout>
      <HomeHeader categories={props.categories} />
      <HomeBrandList brands={props.brands} />
    </Layout>
  )
}

export default HomePageContent
