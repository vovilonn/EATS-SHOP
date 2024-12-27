import { FC, useEffect, useState } from 'react';
import IProduct from '@/shared/interfaces/product.interface';
import ProductList from '@/shared/components/product-list';
import Button from '@/shared/components/ui/button';
import Axios from '@/shared/utils/axios.utility';

import style from './style.module.scss';

interface IProductsProductListProps {
  products: Array<IProduct>;
  categoryId?: number;
}

const ProductsProductList: FC<IProductsProductListProps> = ({
  products: initialProducts,
  categoryId,
}) => {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [hasMore, setHasMore] = useState(initialProducts.length === 6);

  useEffect(() => {
    setProducts(initialProducts);
    // setIsLoading(false);
    // setCurrentPage(1);
    // setHasMore(initialProducts.length === 6);
  }, [initialProducts]);

  // const loadMoreProducts = async () => {
  //   setIsLoading(true);

  //   try {
  //     const nextPage = currentPage + 1;
  //     const response = await Axios({
  //       method: 'get',
  //       url: `/menu/view?limit=6&page=${nextPage}&general_categories_id=${categoryId}`,
  //     });

  //     const newProducts = response.data;

  //     // Добавляем новые продукты в общий список
  //     setProducts((prevProducts) => [...prevProducts, ...newProducts]);

  //     // Обновляем текущую страницу
  //     setCurrentPage(nextPage);

  //     // Проверяем, есть ли еще товары
  //     setHasMore(newProducts.length === 6);
  //   } catch (error) {
  //     console.error('Ошибка при загрузке товаров:', error);
  //     // Возможно, скрыть кнопку или показать сообщение об ошибке
  //     setHasMore(false); // Прекратить загрузку товаров в случае ошибки
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <section className={style.products}>
      <ProductList products={products} />
      {/* {hasMore && (
        <Button
          className={style.view}
          view
          onClick={loadMoreProducts}
          disabled={isLoading}
        >
          {isLoading ? 'Загрузка...' : 'Дивитися все'}
        </Button>
      )} */}
      {products.length === 0 && (
        <p>Товары не найдены.</p> // Сообщение, если нет товаров
      )}
    </section>
  );
};

export default ProductsProductList;
