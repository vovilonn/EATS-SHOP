import { FC, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IWallet } from '@/shared/interfaces/wallet.interface';

import LoggedLayout from '@/shared/layouts/logged';
import FormInput from '@/shared/components/ui/form/form-input';
import WalletHeader from './components/header';
import Button from '@/shared/components/ui/button';

import style from './style.module.scss';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import {
  createReplenishment,
  getHistoryReplenishment,
} from '@/shared/store/wallet/requests';
import EmptyCard from '@/shared/components/empty-card';

const WalletPageContent: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const [amount, setAmount] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const { replenishments, loading, error } = useTypedSelector(
    (state) => state.wallet
  );

  useEffect(() => {
    dispatch(getHistoryReplenishment());
  }, [dispatch]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (formError) {
      setFormError(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedAmount = parseInt(amount);

    if (amount === '' || isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Введіть коректну суму більше 0');
      return;
    }

    try {
      const resultAction = await dispatch(
        createReplenishment(parsedAmount)
      ).unwrap();
      await dispatch(getHistoryReplenishment());

      if (resultAction.url_page) {
        window.open(resultAction.url_page, '_blank');
      }

      setAmount('');
    } catch (error) {
      console.error('Ошибка при пополнении:', error);
    }
  };

  return (
    <LoggedLayout>
      <WalletHeader />

      <section className={style.wallet}>
        <form
          className={`${style.form} ${formError || error ? style.error : ''}`}
          onSubmit={handleFormSubmit}
        >
          <FormInput
            placeholder="Введіть суму поповнення"
            value={amount}
            onChange={handleAmountChange}
            large
          />
          {formError && <span className={style.error}>{formError}</span>}
          {error && (
            <span className={style.error}>Помилка сервера: {error}</span>
          )}
          <Button
            className={style.btn}
            type="submit"
            basket
            disabled={loading === 'pending'}
          >
            Поповнити
          </Button>
        </form>

        <h1 className={style.title}>Історія поповнень</h1>
        {replenishments.length !== 0 ? (
          <div className={style.history}>
            {loading === 'pending' ? (
              <p>Завантаження...</p>
            ) : (
              replenishments.map((item: IWallet) => (
                <div key={item.id} className={style.item}>
                  <p>
                    {new Date(item.createdAt * 1000).toLocaleDateString(
                      'uk-UA',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}
                  </p>
                  <p>+{item.amount} грн</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p>Історія поповнень порожня 😯</p>
          </div>
        )}
      </section>
    </LoggedLayout>
  );
};

export default WalletPageContent;
