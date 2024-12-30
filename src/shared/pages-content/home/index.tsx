import { FC } from 'react';

import ICategory from '@/shared/interfaces/category.interface';

import Layout from '@/shared/layouts/default';

import HomeHeader from './components/header';
import HomeBrandList from './components/brand-list';
import {ScheduleLine} from "@/shared/components/ui/schedule-line";

interface IHomePageContentProps {
  categories: ICategory[];
}

const HomePageContent: FC<IHomePageContentProps> = (props) => {
  return (
    <Layout>
      <ScheduleLine />
      <HomeHeader categories={props.categories} />
      <HomeBrandList />
    </Layout>
  );
};

export default HomePageContent;
