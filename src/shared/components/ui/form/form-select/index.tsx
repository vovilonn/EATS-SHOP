import { FC, useState } from 'react';

import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { useActions } from '@/shared/hooks/use-actions';

import ArrowDownIcon from '@/shared/assets/icons/triangle-arrow-down-icon.svg';

import style from './style.module.scss';
import ICity from '@/shared/interfaces/city.interface';

interface IFormSelectProps {
  options: ICity[];
  selectedOptionsId?: number | null;
  large?: boolean;
  onChange?: (id: number) => void;
  needAuth?: boolean;
}

const FormSelect: FC<IFormSelectProps> = props => {
  const stateAuth = useTypedSelector(state => state.auth);
  const actions = useActions();
  
  // Используем состояние для выбранного города
  const [selectedCityId, setSelectedCityId] = useState<number>(props.selectedOptionsId || 0);
  const [isSelected, setSelected] = useState<boolean>(!!props.selectedOptionsId);

  const classNameWraper: string = `
    ${style.wraper}
    ${props.large && style.large}
    ${isSelected && style.valid}
  `;

  const onChange = (id: number) => {
    if (props.needAuth && !stateAuth.isAuth) {
      actions.setNeedAuth(true);
    } else {
      setSelectedCityId(id); // Обновляем выбранный город
      setSelected(true);
      actions.setSelectedCityId(id); // Обновляем выбранный город в глобальном состоянии
      props.onChange && props.onChange(id);
    }
  };

  const optionsRendering = props.options.map(option => (
    <option key={option.id} value={option.id}>
      {option.name}
    </option>
  ));

  return (
    <div className={classNameWraper}>
      <select
        className={style.select}
        onChange={e => onChange(Number(e.target.value))}
        value={selectedCityId} // Отображаем выбранный город
      >
        <option value="0" disabled>
          Місто
        </option>
        {optionsRendering}
      </select>
      {!isSelected && <span className={style.placeholder}>Місто</span>}
      <ArrowDownIcon className={style.icon} />
    </div>
  );
};

export default FormSelect;
