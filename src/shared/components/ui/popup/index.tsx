import { FC, ReactNode } from 'react'

import style from './style.module.scss'

interface IPopupProps {
  children: ReactNode
  visible: boolean
  notification?: boolean
  onClose: () => void
}

const Popup: FC<IPopupProps> = props => {
  const classNameWraper: string = `
    ${style.wraper}
    ${props.visible && style.visible}
  `

  return (
    <div className={classNameWraper}>
      <div className={style.background} onClick={props.onClose} />
      {props.children}
    </div>
  )
}

export default Popup
