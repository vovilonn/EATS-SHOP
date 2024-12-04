import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import IProduct from '@/shared/interfaces/product.interface';
import ICategory from '@/shared/interfaces/category.interface';
import Axios from '@/shared/utils/axios.utility';
import ProductsPageContent from '@/shared/pages-content/products';

interface IProductsCategoryPageProps {
  products: IProduct[];
  categories: ICategory[];
  category: ICategory;
}

const ProductsCategoryPage: NextPage<IProductsCategoryPageProps> = (props) => {
  return (
    <ProductsPageContent
      products={props.products}
      category={props.category}
      categories={props.categories}
    />
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await Axios({ method: 'get', url: '/menu/general_categories/view' });
    const categories = response.data;

    if (!Array.isArray(categories) || !categories.length) {
      throw new Error('Не удалось загрузить категории');
    }

    const paths = categories.map((category: ICategory) => ({
      params: { id: String(category.id) },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps = async (props) => {
  const categoryId = props.params?.id;

  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      Axios({ method: 'get', url: `/menu/view?limit=6&page=1&general_categories_id=${categoryId}` }),
      Axios({ method: 'get', url: '/menu/general_categories/view' }),
    ]);

    const products = productsResponse.data || []; // Если продуктов нет, возвращаем пустой массив
    const categories = categoriesResponse.data;

    const category = categories.find(
      (category: ICategory) => category.id === Number(categoryId)
    );

    if (!category) {
      return { notFound: true };
    }

    return {
      props: { products, categories, category },
      revalidate: 200,
    };
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return {
      notFound: true, // Показываем страницу 404 в случае ошибки
    };
  }
};

export default ProductsCategoryPage;
