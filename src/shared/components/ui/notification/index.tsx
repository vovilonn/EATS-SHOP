import { Dispatch, FC, ReactNode, SetStateAction, useEffect } from 'react'

import style from './style.module.scss'

interface INotificationProps {
  children: ReactNode
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
}

const Notification: FC<INotificationProps> = props => {
  const classNameWraper: string = `
    ${style.wraper}
    ${props.visible && style.visible}
  `

  useEffect(() => {
    if (props.visible) {
      setTimeout(() => props.setVisible(false), 1000)
    }
  }, [props.visible])

  return (
    <div className={classNameWraper}>
      <div className={style.content}>{props.children}</div>
    </div>
  )
}

export default Notification
