import { FC } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import * as cookies from 'cookies-next';

import { useActions } from '@/shared/hooks/use-actions';

import CheckedIcon from '@/shared/assets/icons/checked-icon.svg';
import WalletIcon from '@/shared/assets/icons/wallet-icon.svg';
import StarIcon from '@/shared/assets/icons/star-icon.svg';
import FriendsIcon from '@/shared/assets/icons/friends-icon.svg';
import AboutIcon from '@/shared/assets/icons/about-icon.svg';
import SettingsIcon from '@/shared/assets/icons/settings-icon.svg';
import ExitIcon from '@/shared/assets/icons/exit-icon.svg';
import ArrowRightIcon from '@/shared/assets/icons/arrow-right-icon.svg';

import style from './style.module.scss';

const ProfileNavigation: FC = () => {
  const actions = useActions();

  const router = useRouter();

  const navigationLinks = [
    { name: 'Замовлення', icon: CheckedIcon, href: '/profile/orders' },
    { name: 'Гаманець', icon: WalletIcon, href: '/profile/wallet' },
    { name: 'Досягнення', icon: StarIcon, href: '/profile/achievements' },
    { name: 'Друзі', icon: FriendsIcon, href: '/profile/friends' },
    { name: 'Про нас', icon: AboutIcon, href: '/' },
    {
      name: 'Налаштування',
      icon: SettingsIcon,
      href: '/profile/personal-info',
    },
    { name: 'Вийти', icon: ExitIcon, href: '/', exit: true },
  ];

  const handleLogout = () => {
    cookies.setCookie('token', '');
    actions.setLogout();
    router.push('/');
  };

  const renderingNavigationLinks = navigationLinks.map((link) => {
    const key = Math.random();
    const classNameLink: string = `${style.link} ${link.exit && style.exit}`;

    if (link.exit) {
      return (
        <Link
          className={classNameLink}
          key={key}
          href={link.href}
          onClick={handleLogout}
        >
          <link.icon className={style.icon} />
          {link.name}
          <ArrowRightIcon className={style.arrow} />
        </Link>
      );
    }

    return (
      <Link className={classNameLink} key={key} href={link.href}>
        <link.icon className={style.icon} />
        {link.name}
        <ArrowRightIcon className={style.arrow} />
      </Link>
    );
  });

  return <nav className={style.links}>{renderingNavigationLinks}</nav>;
};

export default ProfileNavigation;
