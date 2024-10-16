import { FC, useEffect, useState } from 'react';
import Title from '@/shared/components/title';
import Button from '@/shared/components/ui/button';
import InfoIcon from '@/shared/assets/icons/info-icon.svg';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { getAccountInfo } from '@/shared/store/account/requests';

const FriendsAction: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { accountInfo } = useTypedSelector((state) => state.accountInfo);
  const { referalls } = useTypedSelector((state) => state.referalls);

  const [hasShowedInfo, setShowedInfo] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getAccountInfo());
  }, [dispatch]);

  const totalSum = referalls.reduce((sum, item) => {
    return sum + Number(item.award_sum) + Number(item.bonus_sum);
  }, 0);

  return (
    <div className={style.wraper}>
      <div className={style.list}>
        <div className={style.items}>
          <div className={style.item}>
            <p className={style.text}>
              Загалом <br /> накопичено:
            </p>
            <Title className={style.title}>{totalSum.toFixed(2)} грн</Title>
          </div>
          <div className={style.item}>
            <p className={style.text}>
              Загалом <br /> запрошених друзів:
            </p>
            <Title className={style.title}>{referalls.length}</Title>
          </div>
        </div>
        <div className={style.ref}>
          <Title className={style.title}>Реферальний код:</Title>
          <div className={style.codeWraper}>
            <p className={style.code}>{accountInfo?.my_referral_code}</p>
            <span
              className={style.icon}
              onClick={() => setShowedInfo((prev) => !prev)}
            >
              <InfoIcon />
            </span>
          </div>
        </div>
        {hasShowedInfo && (
          <p className={style.text}>
            Запроси свого друга в додаток та отримай +50 грн на свій eats
            гаманець. Також ти додатково отримуєш 0,5% від суми його першого
            замовлення. Тож гайда ділись додатком!
          </p>
        )}
      </div>
      <Button className={style.btn} basket>
        Поділитися
      </Button>
    </div>
  );
};

export default FriendsAction;
