import { FC } from 'react'

import Breadcrumbs from '@/shared/components/ui/breadcrumbs'
import BreadcrumbBack from '@/shared/components/ui/breadcrumbs/components/breadcrumb-back'
import BreadcrumbGeneral from '@/shared/components/ui/breadcrumbs/components/breadcrumb-general'
import BreadcrumbName from '@/shared/components/ui/breadcrumbs/components/breadcrumb-name'
import BreadcrumbCategory from '@/shared/components/ui/breadcrumbs/components/breadcrumb-category'

import MenuIcon from '@/shared/assets/icons/menu-icon.svg'
import ArrowRightIcon from '@/shared/assets/icons/arrow-right-icon.svg'

import style from './style.module.scss'
import ICategory from "@/shared/interfaces/category.interface";
import {useRouter} from "next/router";

interface IProps {
  category: ICategory;
  productName: string;
}

const ProductHeader: FC<IProps> = ({ category, productName }) => {
  const { back } = useRouter();

  return (
    <header className={style.header}>
      <Breadcrumbs>
        <BreadcrumbBack onClick={back} />
        <BreadcrumbGeneral icon={MenuIcon} name='Меню' href='/' />
        <ArrowRightIcon />
        <BreadcrumbCategory
          icon={category.icon}
          name={category.name}
          href={`/products/category/${category.id}`}
        />
        <ArrowRightIcon />
        <BreadcrumbName name={productName} />
      </Breadcrumbs>
    </header>
  )
}

export default ProductHeader
