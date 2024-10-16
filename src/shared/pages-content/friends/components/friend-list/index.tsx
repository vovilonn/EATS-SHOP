import { FC, useEffect } from 'react';

import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { getMyReferalls } from '@/shared/store/referrals/requests';

const FriendsFriendList: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { referalls } = useTypedSelector((state) => state.referalls);

  useEffect(() => {
    dispatch(getMyReferalls());
  }, []);

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
          {referalls.map((item) => (
            <tr key={item.account_id}>
              <td>{item.name}</td>
              <td>+{item.award_sum}</td>
              <td>+{item.bonus_sum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FriendsFriendList;
