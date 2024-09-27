import { FC, useEffect, useState } from 'react';
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

const ProfileCard: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { accountInfo } = useTypedSelector((state) => state.accountInfo);

  const router = useRouter();
  const [previewImage, setPreviewImage] = useState('');
  const isRoute = router.asPath.includes('/personal-info');
  const neddAddImage = !previewImage && isRoute;
  const classNameImage: string = `${style.image} ${isRoute && style.event}`;

  const onLoadFile = (e: any) => {
    const image = URL.createObjectURL(e.target.files[0]);
    setPreviewImage(image);
  };

  useEffect(() => {
    dispatch(getAccountInfo());
  }, []);

  return (
    <article className={style.profile}>
      <div className={style.mediaWrapper}>
        <label className={classNameImage} htmlFor="file">
          {previewImage && (
            <>
              <Image
                className={style.preview}
                width="397"
                height="262"
                src={previewImage}
                alt="user image"
              />

              <span
                className={style.remove}
                onClick={(e) => e.preventDefault()}
              >
                <RemoveIcon />
              </span>
            </>
          )}
          {!previewImage && (
            <span className={style.empty}>
              {!neddAddImage && <ProfileIcon className={style.icon} />}
              {neddAddImage && <AddProfileIcon className={style.icon} />}
            </span>
          )}
          <input
            id="file"
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => onLoadFile(e)}
          />
        </label>
        <div className={style.container}>
          <div className={style.row}>
            <h2 className={style.name}>{accountInfo?.name}</h2>
            <p className={style.balance}>{accountInfo?.balance} ₴</p>
          </div>
          <div className={style.progress}>
            <label className={style.number} htmlFor="progress">
              37 %
            </label>
            <progress
              className={style.value}
              id="progress"
              max="100"
              value="37"
            />
          </div>
          <p className={style.level}>
            <b>Рівень:</b> Bronze
          </p>
          <p className={style.cashback}>
            <b>Кешбек:</b> 1%
          </p>
        </div>
      </div>
    </article>
  );
};

export default ProfileCard;
