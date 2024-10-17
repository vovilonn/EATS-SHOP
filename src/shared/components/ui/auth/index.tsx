import { FC, useEffect, useState } from 'react';

import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { useActions } from '@/shared/hooks/use-actions';

import Popup from '../popup';
import PopupContent from '../popup/components/content';
import PopupNumberPhone from '../popup/components/number-phone';
import PopupLogin from '../popup/components/login';
import PopupPersonalInfo from '../popup/components/personal-info';

const Auth: FC = () => {
  const stateAuth = useTypedSelector((state) => state.auth);
  const actions = useActions();
  const [numberPhone, setNumberPhone] = useState('');
  const [visible, setVisible] = useState(false);
  const [visiblePhoneNumber, setVisiblePhoneNumber] = useState(false);
  const [visibleLogin, setVisibleLogin] = useState(false);
  const [visiblePersonal, setVisiblePersonal] = useState(false);

  useEffect(() => {
    setVisible(stateAuth.needAuth);
    setVisiblePhoneNumber(stateAuth.needAuth);
  }, [stateAuth.needAuth]);

  const onClose = () => {
    actions.setNeedAuth(false);
    setVisible(false);
    setVisibleLogin(false);
    setVisiblePhoneNumber(false);
    setVisiblePersonal(false);
  };

  const onSubmitNumberPhone = (value: string) => {
    setVisiblePhoneNumber(false);
    setNumberPhone(value);
    setVisibleLogin(true);
  };

  const onSubmitLogin = (userdata: { [key: string]: string }) => {
    setVisibleLogin(false);

    if (!(Object.keys(userdata.model_city || {}).length && userdata.name)) {
      setVisiblePersonal(true);
    } else {
      onClose();
    }
  };

  const onSubmitPersonal = () => {
    onClose();
  };

  return (
    <>
      <Popup visible={visible} onClose={onClose}>
        <PopupContent visible={visiblePhoneNumber} onClose={onClose}>
          <PopupNumberPhone onSubmit={(value) => onSubmitNumberPhone(value)} />
        </PopupContent>
        <PopupContent visible={visibleLogin} onClose={onClose}>
          <PopupLogin
            numberPhone={numberPhone}
            onSubmit={onSubmitLogin}
            setVisiblePhoneNumber={setVisiblePhoneNumber}
            setVisibleLogin={setVisibleLogin}
          />
        </PopupContent>
        <PopupContent visible={visiblePersonal} onClose={onClose}>
          <PopupPersonalInfo onSubmit={onSubmitPersonal} />
        </PopupContent>
      </Popup>
    </>
  );
};

export default Auth;
