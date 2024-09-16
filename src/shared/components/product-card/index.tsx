import { FC, useState } from 'react'
import Link from 'next/link'
import { useDispatch } from 'react-redux'

import sliceTextUtility from '@/shared/utils/slice-text.utility'
import optionsRenderingUtility from '@/shared/utils/options-rendering.utility'
import totalPriceUtility from '@/shared/utils/total-price.utility'

import AmountToggle from '../ui/amount-toggle'
import { useActions } from '@/shared/hooks/use-actions'
import { useTypedSelector } from '@/shared/hooks/use-typed-selector'

import { addToFavorite } from '@/shared/store/favorite/requests'
import { TypeDispatch } from '@/shared/store'

import IProduct from '@/shared/interfaces/product.interface'

import LikeIcon from '@/shared/assets/icons/like-icon.svg'
import RemoveIcon from '@/shared/assets/icons/remove-icon.svg'

import style from './style.module.scss'

interface IProductCardProps extends IProduct {
  basket?: boolean
  toggleAmountFull?: boolean
  minAmount?: number
}

const ProductCard: FC<IProductCardProps> = props => {
  const actions = useActions()
  const dispatch = useDispatch<TypeDispatch>()
  const stateAuth = useTypedSelector(state => state.auth)

  const [ price, setPrice ] = useState<number>(props.options[ 0 ].price)
  const [ amount, setAmount ] = useState<number>(props.basket ? 1 : 0)
  const [ selectedOption, setOption ] = useState<string>(props.options[ 0 ].name)
  const [ isFavorite, setFavorite ] = useState<boolean>(props.is_favorite)

  const totalPrice = totalPriceUtility({ amount, price })
  const classNameProduct: string = `
    ${ style.product }
    ${ props.basket && style.basket }
  `

  const onToggleToFavorite = async () => {
    try {
      if (stateAuth.isAuth) {
        const response = await dispatch(addToFavorite(props.id))

        if (response.payload?.status === 'OK') {
          setFavorite(prev => !prev)

          if (isFavorite) {
            actions.removeProduct(props.id)
          }
        }
      } else {
        actions.setNeedAuth(true)
      }
    } catch (error) {
      console.log('error =>', error)
    }
  }

  const onSelectOption = (option: any) => {
    if (stateAuth.isAuth) {
      setPrice(option.price)
      setOption(option.name)
    } else {
      actions.setNeedAuth(true)
    }
  }

  const optionsRendering = optionsRenderingUtility({
    style,
    options: props.options,
    onSelectOption,
    selectedOption,
  })

  return (
    <article className={ classNameProduct }>
      <div className={ style.wrapper }>
        <header
          className={ style.header }
          style={ { backgroundImage: `url(${ props.picture[ 0 ] })` } }
        />
        <div className={ style.containerWrapper }>
          
        
        <div className={ style.container }>
          <div className={ style.row }>
            <h1 className={ style.title }>
              <Link href={ `/product/${ props.id }` }>
                { sliceTextUtility(props.name, 25) }
              </Link>
            </h1>
            { isFavorite && (
              <RemoveIcon className={ style.icon } onClick={ onToggleToFavorite } />
            ) }
            { !isFavorite && (
              <LikeIcon className={ style.icon } onClick={ onToggleToFavorite } />
            ) }
          </div>

          { !props.basket && (
            <p className={ style.composition }>
              Склад: { sliceTextUtility(props.composition, 35) }
            </p>
          ) }

          { props.basket && (
            <>
              <p className={ style.composition }>(30 см), 490 гр</p>
              <p className={ style.components }>+ шинка королівська (23 грн)</p>
            </>
          ) }

          { !props.basket && <div className={ style.options }>{ optionsRendering }</div> }

          <footer className={ style.footer }>
            <h2 className={ style.price }>{ totalPrice } грн</h2>
            { props.basket && <button className={ style.edit }>Змінити</button> }
            <AmountToggle
              setAmount={ setAmount }
              amount={ amount }
              basket={ props.basket }
              minAmount={ props.minAmount }
              full={ props.toggleAmountFull }
            />
          </footer>
        </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
