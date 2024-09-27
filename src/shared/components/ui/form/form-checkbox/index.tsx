import { FC, ReactNode } from 'react';

import CheckedIcon from '@/shared/assets/icons/checked-icon.svg';

import style from './style.module.scss';

interface IFormCheckboxProps {
  children: ReactNode;
  onChange: (checked: boolean) => void;
  className?: string;
  large?: boolean;
  checked?: boolean; 
  disabled?: boolean;
}

const FormCheckbox: FC<IFormCheckboxProps> = (props) => {
  const htmlFor: string = Math.random().toString();
  const classNameWraper: string = `
    ${style.wraper}
    ${props.className}
    ${props.large && style.large}
  `;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.checked);
  };

  return (
    <label className={classNameWraper} htmlFor={htmlFor}>
      <span className={style.label}>{props.children}</span>
      <input
        className={style.checkbox}
        id={htmlFor}
        type='checkbox'
        onChange={handleChange}
        checked={props.checked} // Use the checked prop to control the checkbox state
      />
      <span className={style.checked}>
        <CheckedIcon className={style.icon} />
      </span>
    </label>
  );
};

export default FormCheckbox;
