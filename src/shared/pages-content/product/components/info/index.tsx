import { FC } from 'react'

import IProduct from '@/shared/interfaces/product.interface'

import ProductPictures from '../pictures'
import ProductAction from '../action'

import style from './style.module.scss'

interface IProductInfoProps extends IProduct {}

const ProductInfo: FC<IProductInfoProps> = props => {
  return (
    <section className={style.row}>
      <ProductPictures picture={props.picture} />
      <ProductAction {...props} />
    </section>
  )
}

export default ProductInfo
