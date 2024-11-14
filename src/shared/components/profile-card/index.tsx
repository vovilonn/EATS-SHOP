import { ChangeEvent, FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import ProfileIcon from '@/shared/assets/icons/profile-icon.svg';
import AddProfileIcon from '@/shared/assets/icons/add-profile-icon.svg';
import RemoveIcon from '@/shared/assets/icons/remove-icon.svg';

import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { getAccountInfo } from '@/shared/store/account/requests';

interface ProfileCardProps {
  previewImage?: File | null;
  onImageUpload?: (file: File) => void;
}

const calculateProgress = (totalAmountSpent: number) => {
  let progressPercentage, name, percentage, progressLabel, currentLevelMax, nextLevelMax;

  if (totalAmountSpent < 5000) {
    progressPercentage = totalAmountSpent / 5000;
    progressLabel = Math.floor(progressPercentage * 100);
    name = 'Bronze';
    percentage = '0%';
    currentLevelMax = 0;
    nextLevelMax = 5000;
  } else if (totalAmountSpent < 10000) {
    progressPercentage = (totalAmountSpent - 5000) / (10000 - 5000);
    progressLabel = Math.floor(progressPercentage * 100);
    name = 'Silver';
    percentage = '0.5%';
    currentLevelMax = 5000;
    nextLevelMax = 10000;
  } else if (totalAmountSpent < 30000) {
    progressPercentage = (totalAmountSpent - 10000) / (30000 - 10000);
    progressLabel = Math.floor(progressPercentage * 100);
    name = 'Gold';
    percentage = '0.75%';
    currentLevelMax = 10000;
    nextLevelMax = 30000;
  } else {
    progressPercentage = 1;
    progressLabel = 100;
    name = 'Diamond';
    percentage = '1%';
    currentLevelMax = 30000;
    nextLevelMax = 0; // No further level
  }

  return { progress: progressPercentage * 100, progressLabel, name, percentage, currentLevelMax, nextLevelMax };
};

const ProfileCard: FC<ProfileCardProps> = (props) => {
  const dispatch = useDispatch<TypeDispatch>();
  const { accountInfo } = useTypedSelector((state) => state.accountInfo);

  const [uploadedImage, setUploadedImage] = useState<File | null>(
    props.previewImage ?? null
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      props.onImageUpload && props.onImageUpload(file);
      setUploadedImage(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    props.onImageUpload && props.onImageUpload(null as unknown as File);
  };

  const imageUrl = uploadedImage
    ? URL.createObjectURL(uploadedImage)
    : accountInfo?.avatar ?? '';

  const router = useRouter();
  const isRoute = router.asPath.includes('/personal-info');
  const needAddImage = !uploadedImage && isRoute;
  const classNameImage: string = `${style.image} ${isRoute && style.event}`;

  useEffect(() => {
    dispatch(getAccountInfo());
  }, []);

  // Используем функцию для получения данных уровня и прогресса
  const { progress, progressLabel, name, percentage, currentLevelMax, nextLevelMax } = calculateProgress(accountInfo?.totalSpent || 0);

  return (
    <article className={style.profile}>
      <div className={style.mediaWrapper}>
        <label className={classNameImage} htmlFor="file">
          {uploadedImage || accountInfo?.avatar ? (
            <>
              <Image
                className={style.preview}
                width="397"
                height="262"
                src={imageUrl}
                alt="user image"
              />
              {isRoute && (
                <span className={style.remove} onClick={handleRemoveImage}>
                  <RemoveIcon />
                </span>
              )}
            </>
          ) : (
            <span className={style.empty}>
              {!needAddImage && <ProfileIcon className={style.icon} />}
              {needAddImage && <AddProfileIcon className={style.icon} />}
            </span>
          )}
          {!uploadedImage && (
            <input
              id="file"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e)}
            />
          )}
        </label>
        <div className={style.container}>
          <div className={style.row}>
            <h2 className={style.name}>{accountInfo?.name}</h2>
            <p className={style.balance}>{accountInfo?.balance} ₴</p>
          </div>
          <div className={style.progress}>
            <label className={style.number} htmlFor="progress">
              {progressLabel} %
            </label>
            <progress
              className={style.value}
              id="progress"
              max="100"
              value={progress}
            />
          </div>
          <p className={style.level}>
            <b>Рівень:</b> {name}
          </p>
          <p className={style.cashback}>
            <b>Кешбек:</b> {percentage}
          </p>
          {nextLevelMax > 0 && (
            <p className={style.nextLevel}>
              {`До наступного рівня: ${nextLevelMax - (accountInfo?.totalSpent || 0)} ₴`}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProfileCard;
