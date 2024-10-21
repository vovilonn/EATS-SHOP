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
