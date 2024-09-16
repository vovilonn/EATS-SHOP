import { FC, ReactNode } from 'react'

import CloseIcon from '@/shared/assets/icons/close-icon.svg'

import style from './style.module.scss'

interface IPopupContentProps {
  children: ReactNode
  visible: boolean
  onClose: () => void
  notification?: boolean
}

const PopupContent: FC<IPopupContentProps> = props => {
  const classNameContent: string = `
    ${style.content}
    ${props.visible && style.visible}
    ${props.notification && style.notification}
  `

  return (
    <div className={classNameContent}>
      <span className={style.close} onClick={props.onClose}>
        <CloseIcon />
      </span>
      {props.children}
    </div>
  )
}

export default PopupContent
