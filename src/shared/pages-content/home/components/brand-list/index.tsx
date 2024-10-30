import { FC, useEffect } from 'react';
import Link from 'next/link';

import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

import { getBrands } from '@/shared/store/brand/requests';

import style from './style.module.scss';

const HomeBrandList: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();

  const { brand_items } = useTypedSelector((state) => state.brand);
  const selectedCityId = useTypedSelector((state) => state.city.selectedCityId);

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch, selectedCityId]);

  const filteredBrands = brand_items.filter(
    (brand) => brand.city_id === selectedCityId
  );

  const brandsRendering = filteredBrands.map((brand) => {
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
