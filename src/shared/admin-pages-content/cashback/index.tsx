import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import {
  createNewLevel,
  deleteLevel,
  editLevel,
  getLevelOptions,
} from '@/shared/store/admin/requests';

import { Button, Form, Input, message, Modal } from 'antd';

import styles from './index.module.scss';
import ILevelOption from '@/shared/interfaces/level-option.interface';

const CashbackPageContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { levelOptions } = useTypedSelector((state) => state.adminPanel);

  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedLevel, setEditedLevel] = useState<ILevelOption | null>(null);

  useEffect(() => {
    dispatch(getLevelOptions());
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    const newLevel = {
      name: values.name,
      min_amount: values.min_amount,
      max_amount: values.max_amount,
      percentage_cashback: values.percentage_cashback,
    };

    try {
      if (!editedLevel) {
        await dispatch(createNewLevel(newLevel));
        message.success('Успешно создано!');
      } else {
        await dispatch(editLevel({ ...newLevel, id: editedLevel.id }));
        message.success('Успешно обновлено!');
      }

      setIsModalOpen(false);
      form.resetFields();

      await dispatch(getLevelOptions());
    } catch (error) {
      message.error('Что то пошло не так!');
      console.log(error);
    }
  };

  const onDelete = async (id: number) => {
    Modal.confirm({
      title: 'Ви впевнені, що хочете видалити?',
      okText: 'Так',
      okType: 'danger',
      cancelText: 'Ні',
      onOk: async () => {
        try {
          await dispatch(deleteLevel(id)).unwrap();
          await dispatch(getLevelOptions());
          message.success('Успішно видалено');
        } catch (error) {
          message.error('Не вдалося видалити!');
        }
      },
    });
  };

  const onEdit = async (level: ILevelOption) => {
    setEditedLevel(level);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: level.name,
      min_amount: level.min_amount,
      max_amount: level.max_amount,
      percentage_cashback: level.percentage_cashback,
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Кэшбек</h2>
      <div>
        <div className={styles.block}>
          {levelOptions.map((level) => (
            <div className={styles.level}>
              <p className={styles.levelTitle}>{level.name}</p>
              <div className={styles.levelInfo}>
                <span className={styles.levelLabel}>Мин.:</span>
                <span className={styles.levelValue}>
                  {level.min_amount} грн
                </span>
              </div>
              <div className={styles.levelInfo}>
                <span className={styles.levelLabel}>Макс.:</span>
                <span className={styles.levelValue}>
                  {level.max_amount} грн
                </span>
              </div>
              <div className={styles.levelInfo}>
                <span className={styles.levelLabel}>Процент:</span>
                <span className={styles.levelValue}>
                  {level.percentage_cashback} %
                </span>
              </div>

              <div className={styles.buttonContainer}>
                <button
                  className={`${styles.button} ${styles.editButton}`}
                  onClick={() => onEdit(level)}
                >
                  ✏️ Редактировать
                </button>
                <button
                  className={`${styles.button} ${styles.deleteButton}`}
                  onClick={() => onDelete(level.id as number)}
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <Button type="primary" onClick={showModal}>
            Добавить уровень
          </Button>
        </div>
      </div>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Название" />
          </Form.Item>
          <Form.Item
            label="Минимальная сумма"
            name="min_amount"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Минимальная сумма" type="number" />
          </Form.Item>
          <Form.Item
            label="Максимальная сумма"
            name="max_amount"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Максимальная сумма" type="number" />
          </Form.Item>
          <Form.Item
            label="Процент"
            name="percentage_cashback"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Процент" type="number" />
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

export default CashbackPageContent;
