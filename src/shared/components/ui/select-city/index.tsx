import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import FormSelect from '../form/form-select'

import { getCities } from '@/shared/store/city/requests'
import { useActions } from '@/shared/hooks/use-actions'

import { TypeDispatch } from '@/shared/store'
import { useTypedSelector } from '@/shared/hooks/use-typed-selector'

interface ISelectCityProps {
  selectedOptionsId?: number
  large?: boolean
  onChange?: (id: number) => void
}

const SelectCity: FC<ISelectCityProps> = props => {
  const dispatch = useDispatch<TypeDispatch>()
  const actions = useActions()
  const storeCity = useTypedSelector(state => state.city)

  const onChange = (id: number) => {
    actions.setSelectedCityId(id)
    props.onChange && props.onChange(id)
  }

  useEffect(() => {
    dispatch(getCities())
  }, [])

  return (
    <FormSelect
      options={storeCity.cities}
      large={props.large}
      selectedOptionsId={storeCity.selectedCityId}
      onChange={onChange}
      needAuth
    />
  )
}

export default SelectCity
