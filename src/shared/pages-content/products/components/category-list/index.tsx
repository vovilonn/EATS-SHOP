import { FC } from 'react'
import ICategory from '@/shared/interfaces/category.interface'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Button from '@/shared/components/ui/button'
import style from './style.module.scss'

interface IProductsCategoryListProps {
  categories: ICategory[];
  categoryId: number;
  onChangeCategoryId: (id: number) => void;
}

const ProductsCategoryList: FC<IProductsCategoryListProps> = ({ categories, onChangeCategoryId, categoryId }) => {
  const renderingFilters = categories.map(filter => (
    <SwiperSlide key={ filter.id } className={ style.slide }>
      <button
        className={ `${style.category} ${categoryId === filter.id ? style.active : ''}` }
        onClick={() => onChangeCategoryId(filter.id)}
      >
        { filter.name }
      </button>
    </SwiperSlide>
  ))

  return (
    <div className={ style.row }>
        <div className={ style.categories }>
          <Swiper slidesPerView={ 'auto' } spaceBetween={ 2 }>
            <SwiperSlide className={ style.slide }>
              <Button
                className={ `${ style.all } ${ categoryId === -1 ? style.active : '' }` }
                onClick={() => onChangeCategoryId(-1)}
              >
                Все
              </Button>
            </SwiperSlide>
            { renderingFilters }
          </Swiper>
        </div>
    </div>
  )
}

export default ProductsCategoryList
