import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useRouter } from 'next/router'

import ICategory from '@/shared/interfaces/category.interface'

import style from './style.module.scss'
import 'swiper/css'

interface ICategoryListProps {
  categories: ICategory[]
}

const CategoryList: FC<ICategoryListProps> = props => {
  const router = useRouter()

  const allClassName: string = `${style.all} ${
    !Boolean(router.query.id) && style.active
  }`

  const categoryRendering = props.categories.map(category => {
    const categoryClassName: string = `
      ${style.category}
      ${
        router.asPath.includes(`/products/category/${category.id}`) &&
        style.active
      }
    `
    return (
      <SwiperSlide key={category.id} className={style.slide}>
        <Link
          className={categoryClassName}
          href={`/products/category/${category.id}`}
        >
          <span className={style.icon}>
            <Image
              width='30'
              height='24'
              src={category.icon}
              alt='category icon'
            />
          </span>
          {category.name}
        </Link>
      </SwiperSlide>
    )
  })

  return (
    <div className={style.categories}>
      {Boolean(props.categories.length) && (
        <Swiper slidesPerView={'auto'} spaceBetween={2}>
          <SwiperSlide className={style.slide}>
            <Link className={allClassName} href='/'>
              Все
            </Link>
          </SwiperSlide>
          {categoryRendering}
        </Swiper>
      )}
    </div>
  )
}

export default CategoryList
