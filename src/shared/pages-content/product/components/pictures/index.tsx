import { FC } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'

import 'swiper/css'
import style from './style.module.scss'

interface IProductPicturesProps {
  picture: Array<string>
}

const ProductPictures: FC<IProductPicturesProps> = props => {
  const renderingPictures = props.picture.map(picture => (
    <SwiperSlide className={style.slide} key={picture}>
      <Image width='498' height='479' src={picture} alt='product image' className={style.image}/>
    </SwiperSlide>
  ))
  return (
    <article className={style.wraper}>
      <Swiper
        className={style.swiper}
        id='product-swiper'
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Pagination]}
      >
        {renderingPictures}
      </Swiper>
    </article>
  )
}

export default ProductPictures
