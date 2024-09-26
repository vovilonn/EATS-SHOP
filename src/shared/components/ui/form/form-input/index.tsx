import { ComponentType, FC, Ref, RefObject } from 'react'
import { InputAttributes } from 'react-digit-input'

import style from './style.module.scss'

interface IFormInputProps {
  type?: string;
  id?: string;
  value?: string;
  className?: string;
  large?: boolean;
  code?: boolean;
  placeholder?: string;
  htmlFor?: string;
  valid?: boolean;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ComponentType<{ className?: string }>;
  reference?: Ref<HTMLInputElement>;
  digitAttr?: InputAttributes;
}

const FormInput: FC<IFormInputProps> = props => {
  const type: string = props.type || 'text'
  const classNameWraper: string = `
    ${style.wraper}
    ${props.className}
    ${props.large && style.large}
    ${props.valid && style.valid}
    ${props.code && style.code}
    ${!!props.icon && style.icon}
  `

  return (
    <div className={classNameWraper}>
      {props.icon && <props.icon className={style.icon} />}

      <input
        ref={props.reference}
        className={style.input}
        id={props.htmlFor}
        type={type}
        onChange={e => props.onChange && props.onChange(e)}
        placeholder={props.placeholder}
        {...props.digitAttr}
      />
    </div>
  )
}

export default FormInput
