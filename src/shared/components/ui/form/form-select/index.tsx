import { FC, useState } from 'react'

import { useTypedSelector } from '@/shared/hooks/use-typed-selector'
import { useActions } from '@/shared/hooks/use-actions'

import ArrowDownIcon from '@/shared/assets/icons/triangle-arrow-down-icon.svg'

import style from './style.module.scss'

interface IFormSelectProps {
  selectedOptionsId?: number | null
  options: Array<{ name: string; id: number }>
  large?: boolean
  onChange?: (id: number) => void
  needAuth?: boolean
}

const FormSelect: FC<IFormSelectProps> = props => {
  const stateAuth = useTypedSelector(state => state.auth)
  const actions = useActions()
  const [isSelected, setSelected] = useState<boolean>(!!props.selectedOptionsId)
  const [selectedOptionsId, setOptionsId] = useState<number>(
    props.selectedOptionsId || 0
  )

  const classNameWraper: string = `
    ${style.wraper}
    ${props.large && style.large}
    ${isSelected && style.valid}
  `

  const onChange = (id: number) => {
    if (props.needAuth && !stateAuth.isAuth) {
      actions.setNeedAuth(true)
    } else {
      setSelected(true)
      setOptionsId(id)
      props.onChange && props.onChange(id)
    }
  }

  const optionsRendering = props.options.map(option => (
    <option key={option.id} value={option.id}>
      {option.name}
    </option>
  ))

  return (
    <div className={classNameWraper}>
      <select
        className={style.select}
        onChange={e => onChange(Number(e.target.value))}
        value={selectedOptionsId}
      >
        <option value='0' disabled>
          Місто
        </option>
        {optionsRendering}
      </select>
      {!isSelected && <span className={style.placeholder}>Місто</span>}
      <ArrowDownIcon className={style.icon} />
    </div>
  )
}

export default FormSelect
