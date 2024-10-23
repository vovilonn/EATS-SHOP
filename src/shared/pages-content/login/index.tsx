import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, message, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import styles from './style.module.scss';
import { loginAdmin, sendNumberCodeAdmin } from '@/shared/store/admin/requests';


const LoginPageContent = () => {
  const [loading, setLoading] = useState(false);
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch<TypeDispatch>();

  const handleSendCode = async (values: { phone: string }) => {
    setLoading(true);
    const { phone } = values;

    try {
      // Запрос на отправку кода по номеру телефона
      await dispatch(sendNumberCodeAdmin({numberPhone: phone}))
      setPhoneNumber(phone);
      setCodeModalVisible(true);
      message.success('Код отправлен на ваш номер');
    } catch (error) {
      message.error('Ошибка при отправке кода');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (values: { code: string }) => {
    setLoading(true);
    const { code } = values;

    try {
      await dispatch(loginAdmin({numberPhone: phoneNumber, code: Number(code)}));
      // localStorage.setItem('authToken', 'dummy-token');
      router.push('/admin');
      message.success('Успешный вход');
      setCodeModalVisible(false);
    } catch (error) {
      message.error('Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.header}>Вход в админку</h1>
      <Form
        onFinish={handleSendCode}
        layout="vertical"
        className={styles.form}
        autoComplete="off"
      >
        <Form.Item
          label="Номер телефона"
          name="phone"
          rules={[{ required: true, message: 'Введите номер телефона' }]}
        >
          <Input placeholder="+380000000000" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.submitButton}
          >
            Отправить код
          </Button>
        </Form.Item>
      </Form>

      <Modal
        visible={codeModalVisible}
        title="Введите код"
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
            rules={[{ required: true, message: 'Введите код из СМС' }]}
          >
            <Input placeholder="Введите код" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.submitButton}
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginPageContent;
