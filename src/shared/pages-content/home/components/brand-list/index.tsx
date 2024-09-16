import { FC } from 'react'
import Link from 'next/link'

import IBrand from '@/shared/interfaces/brand.interface'

import style from './style.module.scss'

interface IHomeBrandListProps {
  brands: IBrand[]
}

const HomeBrandList: FC<IHomeBrandListProps> = props => {
  const brandsRendering = props.brands.map(brand => {
    return (
      <Link
        className={ style.brand }
        key={ brand.id }
        href={ `/products/brand/${ brand.id }` }
        style={ { backgroundImage: `url(${ brand.picture })` } }
      />
    )
  })

  return <div className={ style.brands }>{ brandsRendering }</div>
}

export default HomeBrandList
