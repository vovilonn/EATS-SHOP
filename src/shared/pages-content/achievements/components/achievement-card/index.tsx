import { FC, useState } from 'react';
import { IAchievement } from '@/shared/interfaces/achievements.interface';

import Image from 'next/image';

import CloseIcon from '@/shared/assets/icons/close-icon.svg';

import style from './style.module.scss';

interface IAchievementsAchievementCardProps extends IAchievement {
  active?: boolean;
}

const AchievementsAchievementCard: FC<IAchievementsAchievementCardProps> = (
  props
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDone = props.progress < props.count;

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className={style.card} onClick={toggleModal}>
        <div className={style.imageWrapper}>
          <Image
            width="120"
            height="120"
            src={props.picture}
            alt="achievement image"
            className={isDone ? style.imageBlurred : ''}
          />
        </div>
        <h1 className={style.title}>{props.header}</h1>
      </div>

      {isModalOpen && (
        <>
          <div className={style.modalOverlay} onClick={toggleModal}></div>
          <div className={style.modal}>
            <div className={style.modalHeader}>
              <h2>{props.header}</h2>
              <CloseIcon className={style.modalClose} onClick={toggleModal} />
            </div>
            <Image
              width="350"
              height="250"
              src={props.picture}
              alt="achievement image"
              className={isDone ? style.imageBlurred : ''}
            />
            {!isDone && (
              <div className={style.statusDone}>
                <h3>Відкрито ✅</h3>
                <p>{props.open_date} 24 черв. 2024</p>
              </div>
            )}
            <p>{props.description}</p>
          </div>
        </>
      )}
    </>
  );
};

export default AchievementsAchievementCard;
