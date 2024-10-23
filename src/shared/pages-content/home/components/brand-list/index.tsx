import { FC, useEffect } from 'react';
import Link from 'next/link';

import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { getBrands } from '@/shared/store/brand/requests';

const HomeBrandList: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();

  // Получаем бренды и выбранный город из глобального состояния
  const { brand_items } = useTypedSelector(state => state.brand);
  const selectedCityId = useTypedSelector(state => state.city.selectedCityId);

  useEffect(() => {
    dispatch(getBrands()); // Получаем все бренды
  }, [dispatch]);

  // Фильтруем заведения по выбранному городу
  const filteredBrands = brand_items.filter(brand => brand.city_id === selectedCityId);

  const brandsRendering = filteredBrands.map(brand => {
    return (
      <Link
        className={style.brand}
        key={brand.id}
        href={`/products/brand/${brand.id}`}
        style={{ backgroundImage: `url(${brand.picture})` }}
      />
    );
  });

  return <div className={style.brands}>{brandsRendering}</div>;
};

export default HomeBrandList;
