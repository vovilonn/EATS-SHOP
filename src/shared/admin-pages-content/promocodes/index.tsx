import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

import {
  createPromocode,
  deletePromocode,
  editPromocode,
  fetchAllPromocodes,
} from '@/shared/store/admin/requests';

import {
  IPromocode,
  IPromocodeCreateOrUpd,
} from '@/shared/interfaces/promocode.interface';

import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Table,
  TableProps,
  Tag,
  Typography,
} from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const PromocodesPageContent = () => {
  const dispatch = useDispatch<TypeDispatch>();

  const { promocodes } = useTypedSelector((state) => state.adminPanel);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<number | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const isEditing = (record: IPromocode) => record.id === editingKey;

  useEffect(() => {
    dispatch(fetchAllPromocodes());
  }, []);

  const columns: TableProps<IPromocode>['columns'] = [
    {
      title: 'Назва',
      dataIndex: 'description',
      key: 'description',
      render: (_, record: IPromocode) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="description"
              style={{ margin: 0 }}
              initialValue={record.description}
              rules={[{ required: true, message: 'Заповніть це поле!' }]}
            >
              <Input />
            </Form.Item>
          );
        }
        return (
          record.description || (
            <span style={{ color: 'gray', fontStyle: 'italic' }}>Невідомо</span>
          )
        );
      },
    },
    {
      title: 'Код',
      dataIndex: 'code',
      key: 'code',
      render: (_, record: IPromocode) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="code"
              style={{ margin: 0 }}
              initialValue={record.code}
              rules={[{ required: true, message: 'Заповніть це поле!' }]}
            >
              <Input />
            </Form.Item>
          );
        }
        return record.code;
      },
    },
    {
      title: 'Кількість',
      dataIndex: 'count',
      key: 'count',
      render: (_, record: IPromocode) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="count"
              style={{ margin: 0 }}
              initialValue={record.value_all_start}
              rules={[{ required: true, message: 'Заповніть це поле!' }]}
            >
              <Input />
            </Form.Item>
          );
        }
        return `${record.count}/${record.value_all_start}`;
      },
    },
    {
      title: 'Знижка',
      dataIndex: 'value',
      key: 'value',
      render: (_, record: IPromocode) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="value"
              style={{ margin: 0 }}
              initialValue={record.value}
              rules={[{ required: true, message: 'Заповніть це поле!' }]}
            >
              <Input />
            </Form.Item>
          );
        }
        return record.value + '%';
      },
    },
    {
      title: 'Статус',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={!isActive ? 'red' : 'green'}>
          {!isActive ? 'Неактивний' : 'Активний'}
        </Tag>
      ),
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: IPromocode) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Зберегти
            </Typography.Link>
            <Typography.Link onClick={cancel}>Скасувати</Typography.Link>
          </span>
        ) : (
          <>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              disabled={editingKey !== null}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              disabled={editingKey !== null}
            />
          </>
        );
      },
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const edit = (record: IPromocode) => {
    setEditingKey(record.id);

    editForm.setFieldsValue({
      code: record.code,
      count: record.count,
      description: record.description,
      value: record.value,
    });
  };

  const cancel = () => {
    setEditingKey(null);
    form.resetFields();
  };

  const save = async (id: number) => {
    try {
      const code = editForm.getFieldValue('code');
      const count = editForm.getFieldValue('count');
      const value = editForm.getFieldValue('value');
      const description = editForm.getFieldValue('description');

      await dispatch(
        editPromocode({
          description,
          value,
          promo_code_id: id,
          code,
          count,
          is_active: true,
          type: 'Disposable',
        })
      ).unwrap();
      message.success('Промокод успішно оновлено');
      setEditingKey(null);
      dispatch(fetchAllPromocodes());
      editForm.resetFields();
    } catch (error) {
      message.error('Не вдалося оновити промокод');
    }
  };

  const handleSubmit = async (values: IPromocodeCreateOrUpd) => {
    const newPromocode = {
      description: values.description,
      code: values.code,
      type: 'Disposable',
      count: values.count,
      value: values.value,
      is_active: true,
    };
    try {
      await dispatch(createPromocode(newPromocode)).unwrap();
      message.success('Промокод успішно створено');
      form.resetFields();
      setIsModalOpen(false);
      await dispatch(fetchAllPromocodes());
    } catch (error) {
      message.error('Не вдалося створити промокод');
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Ви впевнені, що хочете видалити промокод?',
      okText: 'Так',
      okType: 'danger',
      cancelText: 'Ні',
      onOk: async () => {
        try {
          await dispatch(deletePromocode(id)).unwrap();
          message.success('Промокод успішно видалено');
          await dispatch(fetchAllPromocodes());
        } catch (error) {
          message.error('Не вдалося видалити промокод');
        }
      },
    });
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: '20px' }}
      >
        Створити новий промокод
      </Button>
      <Form form={editForm} component={false}>
        <Table columns={columns} dataSource={promocodes} rowKey="id" />
      </Form>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Назва"
            name="description"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Введіть назву" />
          </Form.Item>
          <Form.Item
            label="Код"
            name="code"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Введіть промокод" />
          </Form.Item>
          <Form.Item
            label="Кількість"
            name="count"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Введіть кількість" type="number" />
          </Form.Item>
          <Form.Item
            label="Знижка"
            name="value"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Введіть відсоток знижки" type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Зберегти
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PromocodesPageContent;
