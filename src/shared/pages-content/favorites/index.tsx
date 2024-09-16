import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { TypeDispatch } from '@/shared/store'
import { useTypedSelector } from '@/shared/hooks/use-typed-selector'
import { getFavorites } from '@/shared/store/favorite/requests'

import LoggedLayout from '@/shared/layouts/logged'
import FavoritesHeader from './components/header'

import ProductList from '@/shared/components/product-list'
import EmptyCard from '@/shared/components/empty-card'

const FavoritesPageContent: FC = () => {
  const stateFavorite = useTypedSelector(state => state.favorite)
  const dispatch = useDispatch<TypeDispatch>()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(getFavorites()).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <LoggedLayout>
      <FavoritesHeader />

      <section>
        {Boolean(stateFavorite.products.length) && !isLoading && (
          <ProductList products={stateFavorite.products} />
        )}
        {!Boolean(stateFavorite.products.length) && !isLoading && (
          <EmptyCard
            title='Ваш список порожній 😯'
            text='Оберіть улюблені товари, щоб не загубити їх'
          />
        )}
      </section>
    </LoggedLayout>
  )
}

export default FavoritesPageContent
