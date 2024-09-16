import { FC } from 'react'

import style from './style.module.scss'

const FriendsFriendList: FC = () => {
  return (
    <div className={style.wraper}>
      <table className={style.table}>
        <thead className={style.thead}>
          <tr>
            <th>Номер друга</th>
            <th>Нагорода</th>
            <th>Бонус</th>
          </tr>
        </thead>
        <tbody className={style.tbody}>
          <tr>
            <td>Ім’я</td>
            <td>+50</td>
            <td>+12.25</td>
          </tr>
          <tr>
            <td>Ім’я</td>
            <td>+50</td>
            <td>+12.25</td>
          </tr>
          <tr>
            <td>Ім’я</td>
            <td>+50</td>
            <td>+12.25</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default FriendsFriendList
