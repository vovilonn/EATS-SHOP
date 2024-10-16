import { FC, useEffect } from 'react';

import LoggedLayout from '@/shared/layouts/logged';
import AchievementsHeader from './components/header';
import AchievementsAchievementCard from './components/achievement-card';

import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { getAllAchievements } from '@/shared/store/achievements/requests';

const AchievementsPageContent: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { achievements } = useTypedSelector((state) => state.achievements);

  useEffect(() => {
    dispatch(getAllAchievements());
  }, []);

  return (
    <LoggedLayout>
      <AchievementsHeader />

      <section className={style.wraper}>
        {achievements.map((item) => (
          <AchievementsAchievementCard {...item} />
        ))}
      </section>
    </LoggedLayout>
  );
};

export default AchievementsPageContent;
