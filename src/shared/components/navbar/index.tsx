import { FC, MouseEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import SelectCity from '../ui/select-city'
import FormInput from '../ui/form/form-input'

import { useActions } from '@/shared/hooks/use-actions'
import { useTypedSelector } from '@/shared/hooks/use-typed-selector'

import activeLinkUtility from './utils/active-link.utility'

import MenuIcon from '@/shared/assets/icons/menu-icon.svg'
import LikeIcon from '@/shared/assets/icons/like-icon.svg'
import BasketIcon from '@/shared/assets/icons/basket-icon.svg'
import ProfileIcon from '@/shared/assets/icons/profile-icon.svg'
import SearchIcon from '@/shared/assets/icons/search-icon.svg'
import PhoneIcon from '@/shared/assets/icons/phone-icon.svg'

import style from './style.module.scss'

const navigationLinks = [
  { name: 'Меню', icon: MenuIcon, href: '/' },
  { name: 'Улюблене', icon: LikeIcon, href: '/profile/favorites' },
  { name: 'Корзина', icon: BasketIcon, href: '/profile/basket' },
  { name: 'Профіль', icon: ProfileIcon, href: '/profile' },
]

const Navbar: FC = () => {
  const stateAuth = useTypedSelector(state => state.auth)
  const actions = useActions()
  const router = useRouter()

  const classNameLink = (href: string): string => {
    const hasActiveLink = activeLinkUtility(href)
    return hasActiveLink ? `${ style.link } ${ style.active }` : style.link
  }

  const onClickLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()

    if (stateAuth.isAuth) {
      router.push(href)
    } else {
      actions.setNeedAuth(true)
    }
  }

  const renderingNavigationLinks = navigationLinks.map(link => {
    const key = Math.random()

    return (
      <Link
        key={ key }
        className={ classNameLink(link.href) }
        href={ link.href }
        onClick={ e => link.href !== '/' && onClickLink(e, link.href) }
      >
        <link.icon />
        <div className={ style.name }>
          { link.name }
        </div>
      </Link>
    )
  })

  return (
    <nav className={ style.navbar }>
      <form className={ style.form }>
        <FormInput icon={ SearchIcon } placeholder='Пошук' />
        <SelectCity />
      </form>

      <div className={ style.links }>
        <div className={ style.navLinks }>
          { renderingNavigationLinks }
        </div>
        <a className={ style.phone } href='tel:050 72 38 600'>
          <PhoneIcon />
          050 72 38 600
        </a>
      </div>
    </nav>
  )
}

export default Navbar
