import {useEffect, useState} from 'react';

import {useDispatch} from 'react-redux';
import {TypeDispatch} from '@/shared/store';
import {useTypedSelector} from '@/shared/hooks/use-typed-selector';

import {createPromocode, deletePromocode, editPromocode, fetchAllPromocodes,} from '@/shared/store/admin/requests';

import {IPromocode, IPromocodeCreateOrUpd, PromocodeTypeValue,} from '@/shared/interfaces/promocode.interface';

import {Button, Form, Input, message, Modal, Radio, Table, TableProps, Tag,} from 'antd';

import {DeleteOutlined, EditOutlined} from '@ant-design/icons';

const PromocodesPageContent = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { promocodes } = useTypedSelector((state) => state.adminPanel);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [typeValuePromocode, setTypeValuePromocode] = useState<
    PromocodeTypeValue
  >(PromocodeTypeValue.PERCENTAGE);
  const [typePromocode, setTypePromocode] = useState<'DISPOSABLE' | 'ONETIME'>(
    'DISPOSABLE'
  );
  const [currentPromocode, setCurrentPromocode] = useState<IPromocode | null>(
    null
  );

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAllPromocodes());
  }, []);

  const columns: TableProps<IPromocode>['columns'] = [
    {
      title: 'Назва',
      dataIndex: 'description',
      key: 'description',
      render: (_, record: IPromocode) =>
        record.description || (
          <span style={{ color: 'gray', fontStyle: 'italic' }}>Невідомо</span>
        ),
    },
    {
      title: 'Код',
      dataIndex: 'code',
      key: 'code',
      render: (_, record: IPromocode) => record.code,
    },
    {
      title: 'Тип промокода',
      dataIndex: 'type',
      key: 'type',
      render: (type: 'DISPOSABLE' | 'ONETIME') => {
        if (type === 'DISPOSABLE') {
          return 'Многоразовый';
        } else {
          return 'Одноразовый';
        }
      },
    },
    {
      title: 'Кількість',
      dataIndex: 'count',
      key: 'count',
      render: (_, record: IPromocode) =>
        `${record.count}/${record.value_all_start}`,
    },
    {
      title: 'Знижка',
      dataIndex: 'value',
      key: 'value',
      render: (_, record: IPromocode) =>
        record.type_value === 'MONEY'
          ? `${record.value} грн`
          : `${record.value}%`,
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
      render: (_, record: IPromocode) => (
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentPromocode(null);
    form.resetFields();
  };

  const handleEdit = (promocode: IPromocode) => {
    setCurrentPromocode(promocode);
    setTypePromocode(promocode.type);
    setTypeValuePromocode(promocode.type_value);
    form.setFieldsValue(promocode);
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const handleSubmit = async (values: IPromocodeCreateOrUpd) => {
    const promocodeData = {
      ...values,
      type: typePromocode,
      type_value: typeValuePromocode,
      is_active: true,
    };

    try {
      if (isEditing && currentPromocode) {
        await dispatch(
          editPromocode({
            ...promocodeData,
            promo_code_id: currentPromocode.id,
          })
        ).unwrap();
        message.success('Промокод успішно відредаговано');
      } else {
        await dispatch(createPromocode(promocodeData)).unwrap();
        message.success('Промокод успішно створено');
      }
      form.resetFields();
      setIsModalOpen(false);
      setCurrentPromocode(null);
      await dispatch(fetchAllPromocodes());
    } catch (error) {
      message.error('Не вдалося зберегти промокод');
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
      <Table columns={columns} dataSource={promocodes} rowKey="id" />

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
          <Form.Item>
            <Radio.Group
              options={[
                { label: 'В процентах', value: 'PERCENTAGE' },
                { label: 'В гривнях', value: 'MONEY' },
              ]}
              onChange={(e) => setTypeValuePromocode(e.target.value)}
              value={typeValuePromocode}
            />
          </Form.Item>
          <Form.Item>
            <Radio.Group
              options={[
                { label: 'Многоразовый', value: 'DISPOSABLE' },
                { label: 'Одноразовый', value: 'ONETIME' },
              ]}
              onChange={(e) => setTypePromocode(e.target.value)}
              value={typePromocode}
            />
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
