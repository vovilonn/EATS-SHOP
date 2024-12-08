import { FC } from 'react';

import IProduct from '@/shared/interfaces/product.interface';
import ICategory from '@/shared/interfaces/category.interface';

import Layout from '@/shared/layouts/default';
import ProductsProductList from './components/product-list';
import ProductsHeader from './components/header';

interface IProductsPageContentProps {
  products: IProduct[];
  categories: ICategory[];
  category?: ICategory;
  brandName?: string;
}

const ProductsPageContent: FC<IProductsPageContentProps> = (props) => {
  return (
    <Layout>
      <ProductsHeader
        category={props.category}
        categories={props.categories}
        brandName={props.brandName}
      />
      <ProductsProductList
        products={props.products}
        // categoryId={props.category.id}
      />
    </Layout>
  );
};

export default ProductsPageContent;
