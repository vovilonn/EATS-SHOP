import { useState } from 'react';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';

import {
  loginAdmin,
  loginProvider,
  sendNumberCodeAdmin,
  sendNumberCodeProvider,
} from '@/shared/store/admin/auth/requests';

import { Form, Input, Button, message, Modal, Checkbox } from 'antd';

import styles from './style.module.scss';

const LoginPageContent = () => {
  const dispatch = useDispatch<TypeDispatch>();

  const [loading, setLoading] = useState(false);
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [form] = Form.useForm();
  const router = useRouter();

  const handleSendCode = async (values: {
    phone: string;
    password: string;
  }) => {
    setLoading(true);
    const { phone, password } = values;

    if (isAdmin) {
      try {
        await dispatch(loginAdmin({ numberPhone: phone, password }));
        message.success('Успішний вхід');
        router.push('/admin');
      } catch (error) {
        message.error('Ошибка при входе');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await dispatch(sendNumberCodeProvider({ numberPhone: phone }));

        setPhoneNumber(phone);
        setCodeModalVisible(true);
        message.success('Код відправлено на ваш номер');
      } catch (error) {
        message.error('Помилка при відправленні коду');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogin = async (values: { code: string }) => {
    setLoading(true);

    const { code } = values;

    try {
      await dispatch(
        loginProvider({ numberPhone: phoneNumber, code: Number(code) })
      );
      router.push('/admin');
      message.success('Успішний вхід');
      setCodeModalVisible(false);
    } catch (error) {
      message.error('Помилка при вході');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.header}>Вхід в адмінку</h1>
      <Form
        onFinish={handleSendCode}
        layout="vertical"
        className={styles.form}
        autoComplete="off"
      >
        <Form.Item
          label="Номер телефону"
          name="phone"
          rules={[{ required: true, message: 'Введіть номер телефону' }]}
        >
          <Input placeholder="+380000000000" />
        </Form.Item>
        {isAdmin && (
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введіть пароль' }]}
          >
            <Input type="password" placeholder="Введите пароль" />
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.submitButton}
          >
            {!isAdmin ? 'Відправити код' : 'Войти'}
          </Button>
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          >
            Головний Адмін
          </Checkbox>
        </Form.Item>
      </Form>

      <Modal
        open={codeModalVisible}
        title="Введіть код"
        onCancel={() => setCodeModalVisible(false)}
        footer={null}
      >
        <Form
          onFinish={handleLogin}
          layout="vertical"
          form={form}
          autoComplete="off"
        >
          <Form.Item
            label="Код"
            name="code"
            rules={[{ required: true, message: 'Введіть код із СМС' }]}
          >
            <Input placeholder="Введіть код" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.submitButton}
            >
              Увійти
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginPageContent;
