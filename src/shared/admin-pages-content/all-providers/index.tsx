import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import {
  CheckCircleOutlined,
  DeleteOutlined,
  StopOutlined,
} from '@ant-design/icons';

import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  TableProps,
  Tag,
} from 'antd';
import IProvider from '@/shared/interfaces/provider.interface';
import {
  blockProvider,
  createNewProvider,
  deleteProvider,
  fetchAllProviders,
  fetchBrands,
} from '@/shared/store/admin/requests';

const { Option } = Select;

const AllProvidersPageContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { providers, brands } = useTypedSelector((state) => state.adminPanel);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAllProviders());
    dispatch(fetchBrands());
  }, [dispatch]);

  const columns: TableProps<IProvider>['columns'] = [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text,
    },
    {
      title: 'Номер телефона',
      dataIndex: 'number',
      key: 'number',
      render: (text) => text,
    },
    {
      title: 'Заведения',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => {
        return (
          <Select placeholder="Все Заведения" style={{ width: 180 }}>
            {brands
              .filter((brand) => brand.creator_id === id)
              .map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: 'Статус',
      dataIndex: 'is_block',
      key: 'is_block',
      render: (isBlock: boolean) => (
        <Tag color={isBlock ? 'red' : 'green'}>
          {isBlock ? 'Неактивный' : 'Активный'}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
          <Button
            type="text"
            icon={record.is_block ? <CheckCircleOutlined /> : <StopOutlined />}
            onClick={() =>
              toggleProviderStatus({
                is_block: record.is_block,
                id_user: record.id,
              })
            }
          />
        </>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    const newProvider = {
      name: values.name,
      number: values.number,
    };

    try {
      await dispatch(createNewProvider(newProvider)).unwrap();
      message.success('Провайдер успешно создан');
      form.resetFields();
      setIsModalOpen(false);
      dispatch(fetchAllProviders());
    } catch (error) {
      message.error('Не удалось создать добавку');
    }
  };

  const handleDelete = async (providerId: number) => {
    try {
      await dispatch(deleteProvider(providerId)).unwrap();
      message.success('Провайдер успешно удален');
      dispatch(fetchAllProviders());
    } catch (error) {
      message.error('Не удалось удалить провайдера');
    }
  };

  const toggleProviderStatus = async ({
    is_block,
    id_user,
  }: {
    is_block: boolean;
    id_user: number;
  }) => {
    try {
      await dispatch(blockProvider({ is_block: !is_block, id_user })).unwrap();
      message.success(
        `Провайдер успешно ${is_block ? 'разблокирован' : 'заблокирован'}`
      );
      dispatch(fetchAllProviders());
    } catch (error) {
      message.error('Не удалось изменить статус провайдера');
    }
  };

  return (
    <>
      <Table<IProvider>
        columns={columns}
        dataSource={providers}
        pagination={false}
      />

      <Button type="primary" onClick={showModal} style={{ marginTop: '20px' }}>
        Создать нового провайдера
      </Button>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Заполните это поле!' }]}
          >
            <Input placeholder="Введите имя провайдера" />
          </Form.Item>
          <Form.Item
            label="Номер телефона"
            name="number"
            rules={[{ required: true, message: 'Заполните это поле!' }]}
          >
            <Input placeholder="Введите номер телефона" />
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

export default AllProvidersPageContent;
