import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

import {
  fetchProviderBrands,
  fetchProviderOrders,
  createNewBrand,
  editProviderBrand,
  deleteBrand,
} from '@/shared/store/admin/provider/requests';
import { fetchCities } from '@/shared/store/admin/requests';

import IBrand from '@/shared/interfaces/brand.interface';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  Upload,
} from 'antd';
import type { TableProps } from 'antd';

import { DeleteOutlined, EditOutlined, InboxOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Option } = Select;

const MainPageProviderContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { brands, cities, orders } = useTypedSelector(
    (state) => state.adminPanel
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCities());
    dispatch(fetchProviderOrders());
    dispatch(fetchProviderBrands());
  }, [dispatch]);

  const columns: TableProps<IBrand>['columns'] = [
    {
      title: 'Изображение',
      dataIndex: 'picture',
      key: 'picture',
      render: (picture: string) => (
        <Image
          width={50}
          height={50}
          src={picture}
          alt="Brand"
          style={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      ),
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text,
    },
    {
      title: 'Город',
      dataIndex: 'city_id',
      key: 'city_id',
      render: (city_id: number) => {
        const city = cities.find((city) => city.id === city_id);
        return city?.name || 'Неизвестно';
      },
    },
    {
      title: 'Кол-во заказов',
      dataIndex: 'orders',
      key: 'orders',
      render: () => orders?.length || 0,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record: IBrand) => (
        <>
          <Button
            onClick={() => editBrand(record)}
            type="link"
            icon={<EditOutlined />}
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
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
    form.resetFields();
    setFile(null);
  };

  const handleFileChange = (info: any) => {
    setFile(info.file);
  };

  const editBrand = (brand: IBrand) => {
    setSelectedBrand(brand);
    form.setFieldsValue({
      title: brand.name,
      city: brand.city_id,
    });
    setFile(null);
    setIsModalOpen(true);
  };

  const onFinish = async (values: any) => {
    if (!file && !selectedBrand?.picture) {
      message.error('Пожалуйста, добавьте изображение');
      return;
    }

    const formData = new FormData();
    formData.append('name', values.title);
    formData.append('city_id', values.city);
    formData.append('location', '10,7');

    if (file) {
      formData.append('picture', file);
    } else if (selectedBrand?.picture) {
      formData.append('picture', selectedBrand.picture);
    }

    try {
      if (selectedBrand) {
        formData.append('store_id', `${selectedBrand.id}`);
        await dispatch(editProviderBrand(formData)).unwrap();
        message.success('Бренд успешно обновлён');
      } else {
        await dispatch(createNewBrand(formData)).unwrap();
        message.success('Бренд успешно создан');
      }

      form.resetFields();
      setFile(null);
      setSelectedBrand(null);
      setIsModalOpen(false);
      dispatch(fetchProviderBrands());
    } catch (error) {
      message.error('Не удалось сохранить бренд');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Вы уверены, что хотите удалить заведение?',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk: async () => {
        try {
          await dispatch(deleteBrand(id)).unwrap();
          message.success('Бренд успешно удалён');
          dispatch(fetchProviderBrands());
        } catch (error) {
          message.error('Не удалось удалить бренд');
        }
      },
    });
  };

  return (
    <>
      <Table<IBrand> columns={columns} dataSource={brands} pagination={false} />

      <Button
        type="primary"
        onClick={() => {
          setSelectedBrand(null);
          showModal();
        }}
        style={{ marginTop: '20px' }}
      >
        Создать заведение
      </Button>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Название"
            name="title"
            rules={[{ required: true, message: 'Заполните это поле!' }]}
          >
            <Input placeholder="Введите название" />
          </Form.Item>
          <Form.Item
            label="Город"
            name="city"
            rules={[{ required: true, message: 'Выберите город!' }]}
          >
            <Select placeholder="Выберите город">
              {cities.map((city) => (
                <Option key={city.id} value={city.id}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Фото"
            name="file"
            rules={[{ required: !selectedBrand, message: 'Добавьте фото' }]}
          >
            <Upload.Dragger
              name="file"
              beforeUpload={() => false}
              onChange={handleFileChange}
              defaultFileList={
                selectedBrand
                  ? [
                      {
                        uid: selectedBrand.id.toString(),
                        name: selectedBrand.name,
                        status: 'done',
                        url: selectedBrand.picture,
                      },
                    ]
                  : []
              }
            >
              <>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Нажмите или перетащите файл для загрузки
                </p>
              </>
            </Upload.Dragger>
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

export default MainPageProviderContent;
