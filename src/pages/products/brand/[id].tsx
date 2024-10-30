import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import ICategory from '@/shared/interfaces/category.interface';
import IBrand from '@/shared/interfaces/brand.interface';
import IProduct from '@/shared/interfaces/product.interface';

import Axios from '@/shared/utils/axios.utility';

import ProductsPageContent from '@/shared/pages-content/products';

interface IProductsBrandPageProps {
  products: IProduct[];
  categories: ICategory[];
  brand: { icon: string };
}

const ProductsBrandPage: NextPage<IProductsBrandPageProps> = (props) => {
  return (
    <ProductsPageContent
      products={props.products}
      categories={props.categories}
      brand={props.brand}
    />
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const brands = (
    await Axios({ method: 'get', url: '/menu/branded_store/view' })
  ).data;

  const paths = brands.map((brand: IBrand) => ({
    params: { id: String(brand.id) },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (props) => {
  const brandId = props.params?.id;

  const getCategories = Axios({
    method: 'post',
    url: '/menu/branded_store_categories/view',
    data: {
      branded_store_id: brandId,
    },
  });

  const getProducts = Axios({
    method: 'get',
    url: `/menu/view?page=1&branded_store_id=${brandId}`,
  });

  const brand = { icon: 'https://iili.io/d8w8w0X.png' };

  const data = await Promise.all([getCategories, getProducts]).then((data) => ({
    categories: data[0].data,
    products: data[1].data,
  }));

  return {
    props: { ...data, brand },
    revalidate: 200,
  };
};

export default ProductsBrandPage;
