import { Dispatch, FC, SetStateAction } from 'react'

import Button from '../../../button'

import CheckedIcon from '@/shared/assets/icons/checked-icon.svg'

import style from './style.module.scss'

interface IPopupWalletReplenishedProps {
  setVisible: Dispatch<SetStateAction<boolean>>
}

const PopupWalletReplenished: FC<IPopupWalletReplenishedProps> = props => {
  const onClose = () => {
    props.setVisible(false)
  }

  return (
    <div className={style.wallet}>
      <span className={style.icon}>
        <CheckedIcon />
      </span>
      <h1 className={style.title}>Ваш гаманець поповнено!</h1>
      <Button className={style.btn} onClick={onClose} basket large>
        Зрозуміло
      </Button>
    </div>
  )
}

export default PopupWalletReplenished
