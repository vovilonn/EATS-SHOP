import { FC } from 'react'
import ICategory from '@/shared/interfaces/category.interface'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Button from '@/shared/components/ui/button'
import style from './style.module.scss'

interface IProductsCategoryListProps {
  categories: ICategory[]
}

const ProductsCategoryList: FC<IProductsCategoryListProps> = props => {
  const renderingFilters = props.categories.map(filter => (
    <SwiperSlide key={ filter.id } className={ style.slide }>
      <button className={ style.category }>{ filter.name }</button>
    </SwiperSlide>
  ))

  return (
    <div className={ style.row }>
        <div className={ style.categories }>
          <Swiper slidesPerView={ 'auto' } spaceBetween={ 2 }>
            <SwiperSlide className={ style.slide }>
              <Button className={ `${ style.all } ${ style.active }` }>Все</Button>
            </SwiperSlide>
            { renderingFilters }
          </Swiper>
        </div>
    </div>
  )
}

export default ProductsCategoryList
