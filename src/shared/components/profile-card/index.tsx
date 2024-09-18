import { FC, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import ProfileIcon from '@/shared/assets/icons/profile-icon.svg'
import AddProfileIcon from '@/shared/assets/icons/add-profile-icon.svg'
import RemoveIcon from '@/shared/assets/icons/remove-icon.svg'

import style from './style.module.scss'

const ProfileCard: FC = () => {
  const router = useRouter()
  const [ previewImage, setPreviewImage ] = useState('')
  const isRoute = router.asPath.includes('/personal-info')
  const neddAddImage = !previewImage && isRoute
  const classNameImage: string = `${ style.image } ${ isRoute && style.event }`

  const onLoadFile = (e: any) => {
    const image = URL.createObjectURL(e.target.files[ 0 ])
    setPreviewImage(image)
  }

  return (
    <article className={ style.profile }>
      <div className={ style.mediaWrapper }>
        <label className={ classNameImage } htmlFor='file'>
          { previewImage && (
            <>
              <Image
                className={ style.preview }
                width='397'
                height='262'
                src={ previewImage }
                alt='user image'
              />

              <span className={ style.remove } onClick={ e => e.preventDefault() }>
                <RemoveIcon />
              </span>
            </>
          ) }
          { !previewImage && (
            <span className={ style.empty }>
              { !neddAddImage && <ProfileIcon className={ style.icon } /> }
              { neddAddImage && <AddProfileIcon className={ style.icon } /> }
            </span>
          ) }
          <input
            id='file'
            type='file'
            style={ { display: 'none' } }
            onChange={ e => onLoadFile(e) }
          />
        </label>
        <div className={ style.container }>
          <div className={ style.row }>
            <h2 className={ style.name }>Василь</h2>
            <p className={ style.balance }>620 ₴</p>
          </div>
          <div className={ style.progress }>
            <label className={ style.number } htmlFor='progress'>
              37 %
            </label>
            <progress className={ style.value } id='progress' max='100' value='37' />
          </div>
          <p className={ style.level }>
            <b>Рівень:</b> Bronze
          </p>
          <p className={ style.cashback }>
            <b>Кешбек:</b> 1%
          </p>
        </div>
      </div>
    </article>
  )
}

export default ProfileCard
