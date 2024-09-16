import { Dispatch, FC, SetStateAction } from 'react'

import { useTypedSelector } from '@/shared/hooks/use-typed-selector'
import { useActions } from '@/shared/hooks/use-actions'

import MinusIcon from '@/shared/assets/icons/minus-icon.svg'
import PlusIcon from '@/shared/assets/icons/plus-icon.svg'

import style from './style.module.scss'

interface IAmountToggleProps {
  setAmount: Dispatch<SetStateAction<number>>
  amount: number
  basket?: boolean
  component?: boolean
  full?: boolean
  minAmount?: number
}

const AmountToggle: FC<IAmountToggleProps> = props => {
  const actions = useActions()
  const stateAuth = useTypedSelector(state => state.auth)
  const classNameAmount = `
    ${style.amount}
    ${props.basket && style.basket}
    ${props.component && style.component}
  `

  const onChangeAmount = (method: string) => {
    if (stateAuth.isAuth) {
      props.setAmount(prev => {
        const calculateAmount = eval(`${prev} ${method} 1`)

        if (calculateAmount < (props.minAmount || 0)) {
          return prev
        }

        return calculateAmount
      })
    } else {
      actions.setNeedAuth(true)
    }
  }

  return (
    <div className={classNameAmount}>
      {(Boolean(props.amount) || props.full) && (
        <>
          <button className={style.btn} onClick={() => onChangeAmount('-')}>
            <MinusIcon />
          </button>
          <p className={style.number}>{props.amount}</p>
        </>
      )}
      <button className={style.btn} onClick={() => onChangeAmount('+')}>
        <PlusIcon />
      </button>
    </div>
  )
}

export default AmountToggle
