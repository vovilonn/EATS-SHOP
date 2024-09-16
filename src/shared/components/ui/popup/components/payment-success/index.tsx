import { Dispatch, FC, SetStateAction } from 'react'

import Button from '../../../button'

import CheckedIcon from '@/shared/assets/icons/checked-icon.svg'

import style from './style.module.scss'

interface IPopupPaymentSuccessProps {
  setVisible: Dispatch<SetStateAction<boolean>>
}

const PopupPaymentSuccess: FC<IPopupPaymentSuccessProps> = props => {
  const onClose = () => {
    props.setVisible(false)
  }

  return (
    <div className={style.success}>
      <span className={style.icon}>
        <CheckedIcon />
      </span>
      <h1 className={style.title}>Оплата пройшла успішно!</h1>
      <p className={style.text}>
        Наш менеджер зв’яжеться з вами протягом 10 хв
      </p>
      <Button className={style.btn} onClick={onClose} basket large>
        Зрозуміло
      </Button>
    </div>
  )
}

export default PopupPaymentSuccess
