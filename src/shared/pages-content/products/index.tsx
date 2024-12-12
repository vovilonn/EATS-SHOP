import {FC, useEffect, useState} from 'react';

import IProduct from '@/shared/interfaces/product.interface';
import ICategory from '@/shared/interfaces/category.interface';

import Layout from '@/shared/layouts/default';
import ProductsProductList from './components/product-list';
import ProductsHeader from './components/header';
import Axios from "@/shared/utils/axios.utility";
import {useParams} from "next/navigation";

interface IProductsPageContentProps {
  products: IProduct[];
  categories: ICategory[];
  category?: ICategory;
  brandName?: string;
}

const ProductsPageContent: FC<IProductsPageContentProps> = (props) => {
  const [products, setProducts] = useState(props.products);
  const params = useParams();
  const brandId = Array.isArray(params?.id) ? +params?.id.join('') : +params?.id;

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  const onChangeCategory = async (categoryId: number) => {
    if (!brandId) {
      return;
    }

    let params = `page=1&branded_store_id=${brandId}&limit=1000000000000`;

    if (categoryId !== -1) {
      params += `&branded_store_categories_id=${categoryId}`;
    }

    const products = await Axios({
      method: 'get',
      url: `/menu/view?${params}`,
    });
    if (products.data) {
      setProducts(products.data);
    }
  }

  return (
    <Layout>
      <ProductsHeader
        category={props.category}
        categories={props.categories}
        brandName={props.brandName}
        onChangeCategory={onChangeCategory}
      />
      <ProductsProductList
        products={products}
        categoryId={props.category?.id}
      />
    </Layout>
  );
};

export default ProductsPageContent;
