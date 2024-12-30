import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRouter } from 'next/router';

import style from './style.module.scss';
import 'swiper/css';

interface ICategory {
  id: number;
  icon: string;
  name: string;
}

interface ICategoryListProps {
  categories?: ICategory[];
}

const CategoryList: FC<ICategoryListProps> = () => {
  const router = useRouter();

  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://eats.in.ua/api/menu/general_categories/view'
        );
        const data = await response.json();
        if (data.status === 'OK') {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      }
    };

    fetchCategories();
  }, []);

  const allClassName: string = `${style.all} ${
    !Boolean(router.query.id) && style.active
  }`;

  // Рендеринг категорий на основе состояния
  const categoryRendering = categories.map((category) => {
    const categoryClassName: string = `
  ${style.category}
  ${
    router.asPath.match(new RegExp(`/products/category/${category.id}($|/)`)) &&
    style.active
  }
`;
    return (
      <SwiperSlide key={category.id} className={style.slide}>
        <Link
          className={categoryClassName}
          href={`/products/category/${category.id}`}
        >
          <span className={style.icon}>
            <Image
              width="30"
              height="24"
              src={category.icon}
              alt="category icon"
            />
          </span>
          {category.name}
        </Link>
      </SwiperSlide>
    );
  });

  return (
    <div className={style.categories}>
      {Boolean(categories.length) && (
        <Swiper slidesPerView={'auto'} spaceBetween={2}>
          <SwiperSlide className={style.slide}>
            <Link className={allClassName} href="/">
              Все
            </Link>
          </SwiperSlide>
          {categoryRendering}
        </Swiper>
      )}
    </div>
  );
};

export default CategoryList;
