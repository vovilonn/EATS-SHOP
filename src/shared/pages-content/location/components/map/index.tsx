import { FC } from 'react'

import Button from '@/shared/components/ui/button'
import Map from '@/shared/components/map'

import LocationIcon from '@/shared/assets/icons/location-icon.svg'

import style from './style.module.scss'

const LocationMap: FC = () => {
  return (
    <section className={style.wraper}>
      <div className={style.map}>
        <Map className={style.iframe} />
        <button className={style.define}>
          <LocationIcon />
          Визначити де я
        </button>
      </div>
      <h2 className={style.address}>
        проспект Небесної Сотні, 111, Одеська область
      </h2>

      <Button className={style.btn} basket>
        Обрати
      </Button>
    </section>
  )
}

export default LocationMap
