import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

import Image from 'next/image';

import {
  fetchProviderBrands,
  fetchProviderOrders,
  createNewBrand,
  editProviderBrand,
  deleteBrand,
} from '@/shared/store/admin/provider/requests';
import { fetchCities } from '@/shared/store/admin/requests';

import IBrand from '@/shared/interfaces/brand.interface';
import { IOrdersHistory } from '@/shared/interfaces/order.interface';

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
import type { TableProps, UploadFile } from 'antd';

import { DeleteOutlined, EditOutlined, InboxOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';

const { Option } = Select;

const MainPageProviderContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { brands, cities, orders } = useTypedSelector(
    (state) => state.adminPanel
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<UploadFile | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);
  const [countOrders, setCountOrders] = useState<Record<number, number>>({});

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCities());
    dispatch(fetchProviderOrders());
    dispatch(fetchProviderBrands());
  }, [dispatch]);

  useEffect(() => {
    if (orders) {
      setCountOrders(totalOrdersForBrands(orders));
    }
  }, [orders]);

  const totalOrdersForBrands = (orders: IOrdersHistory[]) => {
    const brandOrdersCount: Record<number, number> = {};

    orders.forEach((order) => {
      const brandId =
        order.cart.cart_items[0]?.model_menu.model_branded_store?.id;

      if (brandId) {
        brandOrdersCount[brandId] = (brandOrdersCount[brandId] || 0) + 1;
      }
    });

    return brandOrdersCount;
  };

  const columns: TableProps<IBrand>['columns'] = [
    {
      title: 'Зображення',
      dataIndex: 'picture',
      key: 'picture',
      render: (picture: string) => (
        <Image
          width={50}
          height={50}
          src={picture}
          alt="Бренд"
          style={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      ),
    },
    {
      title: 'Назва',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text,
    },
    {
      title: 'Місто',
      dataIndex: 'city_id',
      key: 'city_id',
      render: (city_id: number) => {
        const city = cities.find((city) => city.id === city_id);
        return city?.name || 'Невідомо';
      },
    },
    {
      title: 'Кількість замовлень',
      dataIndex: 'orders',
      key: 'orders',
      render: (_, record) => countOrders[record.id] || 0,
    },
    {
      title: 'Дії',
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
    const file = info.file.originFileObj || info.file;
    const newFile: UploadFile = {
      uid: file.uid || String(new Date().getTime()),
      name: file.name,
      status: 'done',
      url: URL.createObjectURL(file),
      originFileObj: file,
    };
    setFile(newFile);
  };

  const editBrand = (brand: IBrand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);

    form.setFieldsValue({
      title: brand.name,
      city: brand.city_id,
    });

    const fileName =
      brand.name +
      '.' +
      (brand.picture.split('/').pop()?.split('.').pop() || 'jpg');

    const fakeFile = {
      uid: '-1',
      name: fileName,
      size: 0,
      type: 'image/jpeg',
      lastModified: Date.now(),
      lastModifiedDate: new Date(),
      webkitRelativePath: '',
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      slice: () => new Blob(),
      stream: () => new ReadableStream(),
      text: () => Promise.resolve(''),
      bytes: () => Promise.resolve(new Uint8Array()),
    } as RcFile;

    const existingFile: UploadFile = {
      uid: '-1',
      name: fileName,
      status: 'done',
      url: brand.picture,
      originFileObj: fakeFile,
    };

    setFile(existingFile);
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append('name', values.title);
    formData.append('city_id', values.city);
    formData.append('location', '10,7');

    console.log(file);

    if (file && file.originFileObj) {
      formData.append('picture', file.originFileObj);
    } else {
      message.error('Будь ласка, додайте зображення!');
      return;
    }

    try {
      if (selectedBrand) {
        formData.append('store_id', `${selectedBrand.id}`);

        await dispatch(editProviderBrand(formData)).unwrap();
        message.success('Бренд успішно оновлено');
      } else {
        await dispatch(createNewBrand(formData)).unwrap();
        message.success('Бренд успішно створено');
      }
      await dispatch(fetchProviderBrands());

      setIsModalOpen(false);
      form.resetFields();
      setFile(null);
      setSelectedBrand(null);
    } catch (error) {
      message.error('Не вдалося зберегти бренд');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Ви впевнені, що хочете видалити заклад?',
      okText: 'Так',
      okType: 'danger',
      cancelText: 'Ні',
      onOk: async () => {
        try {
          await dispatch(deleteBrand(id)).unwrap();
          message.success('Бренд успішно видалено');
          dispatch(fetchProviderBrands());
        } catch (error) {
          message.error('Не вдалося видалити бренд');
        }
      },
    });
  };

  return (
    <>
      <Table<IBrand>
        rowKey="id"
        columns={columns}
        dataSource={brands}
        pagination={false}
      />

      <Button
        type="primary"
        onClick={() => {
          setSelectedBrand(null);
          showModal();
        }}
        style={{ marginTop: '20px' }}
      >
        Створити заклад
      </Button>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Назва"
            name="title"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Введіть назву" />
          </Form.Item>
          <Form.Item
            label="Місто"
            name="city"
            rules={[{ required: true, message: 'Виберіть місто!' }]}
          >
            <Select placeholder="Виберіть місто">
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
            rules={[{ required: !selectedBrand, message: 'Додайте фото' }]}
          >
            <Upload.Dragger
              name="file"
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={file ? [file] : []}
            >
              <>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Натисніть або перетягніть файл для завантаження
                </p>
              </>
            </Upload.Dragger>
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

export default MainPageProviderContent;
