import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import { editOrderOption, getOrderOption } from '@/shared/store/admin/requests';

import { Button, Form, Input, message, Modal } from 'antd';

import styles from './index.module.scss';

const SettingsPageContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { orderOption } = useTypedSelector((state) => state.adminPanel);

  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getOrderOption());
  }, []);

  const showModal = () => {
    setIsModalOpen(true);

    form.setFieldsValue({
      deliveryPrice: orderOption?.delivery_price,
      minDeliveryNotPrice: orderOption?.min_delivery_not_price,
      singlePaymentReferral: orderOption?.single_payment_referral,
      percentReferral: orderOption?.percent_referral,
      minSumSinglePaymentReferral: orderOption?.min_sum_single_payment_referral,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    const newOption = {
      delivery_price: Number(values.deliveryPrice),
      min_delivery_not_price: Number(values.minDeliveryNotPrice),
      single_payment_referral: Number(values.singlePaymentReferral),
      percent_referral: Number(values.percentReferral),
      min_sum_single_payment_referral: Number(
        values.minSumSinglePaymentReferral
      ),
    };

    try {
      await dispatch(editOrderOption(newOption));
      await dispatch(getOrderOption());

      message.success('Успешно обновлено!');

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Что то пошло не так!');
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Общие настройки по сайту</h2>
      <div className={styles.settingsList}>
        <div className={styles.settingItem}>
          <p className={styles.label}>Цена за доставку</p>
          <p className={styles.value}>{orderOption?.delivery_price} грн</p>
        </div>
        <div className={styles.settingItem}>
          <p className={styles.label}>Порог бесплатной доставки</p>
          <p className={styles.value}>
            {orderOption?.min_delivery_not_price} грн
          </p>
        </div>
        <div className={styles.settingItem}>
          <p className={styles.label}>Разовый бонус</p>
          <p className={styles.value}>
            {orderOption?.single_payment_referral} грн
          </p>
        </div>
        <div className={styles.settingItem}>
          <p className={styles.label}>Процент с заказа</p>
          <p className={styles.value}>{orderOption?.percent_referral}%</p>
        </div>
        <div className={styles.settingItem}>
          <p className={styles.label}>Мин. сумма для разового бонуса</p>
          <p className={styles.value}>
            {orderOption?.min_sum_single_payment_referral} грн
          </p>
        </div>
      </div>
      <div className={styles.actions}>
        <Button type="primary" onClick={showModal}>
          Изменить настройки
        </Button>
      </div>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Цена за доставку" name="deliveryPrice">
            <Input placeholder="Цена за доставку" type="number" />
          </Form.Item>
          <Form.Item
            label="Порог бесплатной доставки"
            name="minDeliveryNotPrice"
          >
            <Input placeholder="Порог бесплатной доставки" type="number" />
          </Form.Item>
          <Form.Item label="Разовый бонус" name="singlePaymentReferral">
            <Input placeholder="Разовый бонус" type="number" />
          </Form.Item>
          <Form.Item label="Процент с заказа" name="percentReferral">
            <Input placeholder="Процент с заказа" type="number" />
          </Form.Item>
          <Form.Item
            label="Мин. сумма для разового бонуса"
            name="minSumSinglePaymentReferral"
          >
            <Input placeholder="Мин. сумма для разового бонуса" type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Зберегти
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SettingsPageContent;
