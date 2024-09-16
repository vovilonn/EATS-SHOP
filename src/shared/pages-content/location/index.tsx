import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged'
import LocationHeader from './components/header'
import LocationMap from './components/map'

const LocationPageContent: FC = () => {
  return (
    <LoggedLayout>
      <LocationHeader />
      <LocationMap />
    </LoggedLayout>
  )
}

export default LocationPageContent
