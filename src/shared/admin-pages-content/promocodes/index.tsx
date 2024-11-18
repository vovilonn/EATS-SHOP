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
              rules={[{ required: true, message: 'Заполните это поле!' }]}
            >
              <Input />
            </Form.Item>
          );
        }
        return record.code;
      },
    },
    {
      title: 'Количество',
      dataIndex: 'count',
      key: 'count',
      render: (_, record: IPromocode) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="count"
              style={{ margin: 0 }}
              initialValue={record.count}
              rules={[{ required: true, message: 'Заполните это поле!' }]}
            >
              <Input />
            </Form.Item>
          );
        }
        return record.count;
      },
    },
    {
      title: 'Статус',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={!isActive ? 'red' : 'green'}>
          {!isActive ? 'Неактивный' : 'Активный'}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: IPromocode) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Сохранить
            </Typography.Link>
            <Typography.Link onClick={cancel}>Отмена</Typography.Link>
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

      await dispatch(
        editPromocode({
          promo_code_id: id,
          code,
          count,
          is_active: true,
          type: 'Disposable',
        })
      ).unwrap();
      message.success('Промокод успешно обновлен');
      setEditingKey(null);
      dispatch(fetchAllPromocodes());
      editForm.resetFields();
    } catch (error) {
      message.error('Не удалось обновить промокод');
    }
  };

  const handleSubmit = async (values: IPromocodeCreateOrUpd) => {
    const newPromocode = {
      code: values.code,
      type: 'Disposable',
      count: values.count,
      is_active: true,
    };
    try {
      await dispatch(createPromocode(newPromocode)).unwrap();
      message.success('Промокод успешно создан');
      form.resetFields();
      setIsModalOpen(false);
      await dispatch(fetchAllPromocodes());
    } catch (error) {
      message.error('Не удалось создать промокод');
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Вы уверены, что хотите удалить промокод?',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk: async () => {
        try {
          await dispatch(deletePromocode(id)).unwrap();
          message.success('Промокод успешно удален');
          await dispatch(fetchAllPromocodes());
        } catch (error) {
          message.error('Не удалось удалить промокод');
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
        Создать новый продукт
      </Button>
      <Form form={editForm} component={false}>
        <Table columns={columns} dataSource={promocodes} rowKey="id" />
      </Form>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Код"
            name="code"
            rules={[{ required: true, message: 'Заполните это поле!' }]}
          >
            <Input placeholder="Введите название" />
          </Form.Item>
          <Form.Item
            label="Количество"
            name="count"
            rules={[{ required: true, message: 'Заполните это поле!' }]}
          >
            <Input placeholder="Введите название" type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PromocodesPageContent;
