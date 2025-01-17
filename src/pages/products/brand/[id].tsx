import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import ICategory from '@/shared/interfaces/category.interface';
import IBrand from '@/shared/interfaces/brand.interface';
import IProduct from '@/shared/interfaces/product.interface';

import Axios from '@/shared/utils/axios.utility';

import ProductsPageContent from '@/shared/pages-content/products';

interface IProductsBrandPageProps {
  products: IProduct[];
  categories: ICategory[];
  brandName: string;
}

const ProductsBrandPage: NextPage<IProductsBrandPageProps> = (props) => {
  return (
    <ProductsPageContent
      products={props.products}
      categories={props.categories}
      brandName={props.brandName}
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

  const allBrands = (
    await Axios({ method: 'get', url: '/menu/branded_store/view' })
  ).data;

  const brand = allBrands.find((b: IBrand) => String(b.id) === brandId);

  if (!brand) {
    return {
      notFound: true,
    };
  }

  const getCategories = Axios({
    method: 'post',
    url: '/menu/branded_store_categories/view',
    data: {
      branded_store_id: brandId,
    },
  });

  const getProducts = Axios({
    method: 'get',
    url: `/menu/view?page=1&branded_store_id=${brandId}&limit=1000000000000`,
  });

  const data = await Promise.all([getCategories, getProducts]).then((data) => ({
    categories: data[0].data,
    products: data[1].data,
  }));

  return {
    props: {
      ...data,
      brandName: brand.name,
    },
    revalidate: 200,
  };
};

export default ProductsBrandPage;
