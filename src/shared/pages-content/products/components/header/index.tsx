import { FC } from 'react';
import Image from 'next/image';

import ICategory from '@/shared/interfaces/category.interface';

import ProductsCategoryList from '../category-list';
import Title from '@/shared/components/title';

import style from './style.module.scss';
import CategoryList from '@/shared/components/category-list';

interface IProductsHeaderProps {
  category?: ICategory;
  categories: ICategory[];
  brandName?: string;
}

const ProductsHeader: FC<IProductsHeaderProps> = (props) => {
  return (
    <header className={style.header}>
      {props.brandName && <Title>{props.brandName}</Title>}

      <div className={style.categoriesList}>
        {!Boolean(Object.keys(props.category || {}).length) && (
          <ProductsCategoryList categories={props.categories} />
        )}
      </div>

      {Boolean(Object.keys(props.category || {}).length) && (
        <CategoryList categories={props.categories} />
      )}
    </header>
  );
};

export default ProductsHeader;
