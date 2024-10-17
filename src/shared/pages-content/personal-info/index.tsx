import { FC, useState } from 'react';

import LoggedLayout from '@/shared/layouts/logged';
import ProfileCard from '@/shared/components/profile-card';
import PersonalInfoHeader from './components/header';
import PersonalInfoUpdate from './components/update';

import style from './style.module.scss';

const PersonalInfoPageContent: FC = () => {
  const [previewImage, setPreviewImage] = useState<File | null>(null);

  const handleImageUpload = (file: File) => {
    setPreviewImage(file);
  };

  return (
    <LoggedLayout>
      <PersonalInfoHeader />

      <section className={style.row}>
        <ProfileCard
          previewImage={previewImage}
          onImageUpload={handleImageUpload}
        />
        <PersonalInfoUpdate previewImage={previewImage} />
      </section>
    </LoggedLayout>
  );
};

export default PersonalInfoPageContent;
