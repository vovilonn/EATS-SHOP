import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { fetchSearchProducts } from '@/shared/store/product/requests';

import { useActions } from '@/shared/hooks/use-actions';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import useDebounce from '@/shared/hooks/use-debounce';

import SelectCity from '../ui/select-city';
import FormInput from '../ui/form/form-input';

import activeLinkUtility from './utils/active-link.utility';

import MenuIcon from '@/shared/assets/icons/menu-icon.svg';
import LikeIcon from '@/shared/assets/icons/like-icon.svg';
import BasketIcon from '@/shared/assets/icons/basket-icon.svg';
import ProfileIcon from '@/shared/assets/icons/profile-icon.svg';
import SearchIcon from '@/shared/assets/icons/search-icon.svg';
import PhoneIcon from '@/shared/assets/icons/phone-icon.svg';

import style from './style.module.scss';

const navigationLinks = [
  { name: 'Меню', icon: MenuIcon, href: '/' },
  { name: 'Улюблене', icon: LikeIcon, href: '/profile/favorites' },
  { name: 'Корзина', icon: BasketIcon, href: '/profile/basket' },
  { name: 'Профіль', icon: ProfileIcon, href: '/profile' },
];

const Navbar: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { searchQuery, searchResults } = useTypedSelector(
    (state) => state.product
  );
  const stateAuth = useTypedSelector((state) => state.auth);
  const actions = useActions();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const classNameLink = (href: string): string =>
    activeLinkUtility(href) ? `${style.link} ${style.active}` : style.link;

  const onClickLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    stateAuth.isAuth ? router.push(href) : actions.setNeedAuth(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setSearchQuery(e.target.value);
  };

  const handleClickOutside = (event: Event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      actions.setSearchQuery('');
    }
  };

  const handleResultClick = (id: number) => {
    actions.setSearchQuery('');
    router.push(`/product/${id}`);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery) {
      setLoading(true);
      dispatch(fetchSearchProducts(debouncedSearchQuery)).finally(() =>
        setLoading(false)
      );
    }
  }, [debouncedSearchQuery]);

  return (
    <nav className={style.navbar}>
      <form className={style.form}>
        <FormInput
          icon={SearchIcon}
          placeholder="Пошук"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <div ref={dropdownRef} className={style.dropdown}>
            {loading ? (
              <div className={style.loader}>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div
                  key={result.id}
                  className={style['dropdown-item']}
                  onClick={() => handleResultClick(result.id)}
                >
                  <SearchIcon />
                  {result.name}
                </div>
              ))
            ) : (
              <div className={style.noResults}>Ничего не найдено</div>
            )}
          </div>
        )}
        <SelectCity />
      </form>

      <div className={style.links}>
        <div className={style.navLinks}>
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              className={classNameLink(link.href)}
              href={link.href}
              onClick={(e) => link.href !== '/' && onClickLink(e, link.href)}
            >
              <link.icon />
              <div className={style.name}>{link.name}</div>
            </Link>
          ))}
        </div>
        <a className={style.phone} href="tel:050 72 38 600">
          <PhoneIcon />
          050 72 38 600
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
