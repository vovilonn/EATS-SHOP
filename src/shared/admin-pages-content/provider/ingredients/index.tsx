import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import IBrand from '@/shared/interfaces/brand.interface';
import IComponent from '@/shared/interfaces/component.interface';

import {
  createNewIngredient,
  deleteIngredient,
  editIngredient,
  fetchProviderBrands,
  fetchProviderIngredients,
} from '@/shared/store/admin/provider/requests';

import { DeleteOutlined, EditOutlined, InboxOutlined } from '@ant-design/icons';

import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  TableProps,
  Upload,
  UploadFile,
} from 'antd';
import Image from 'next/image';
import { RcFile } from 'antd/es/upload';

const { Option } = Select;

const ProviderIngredientsContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { brands, ingredients } = useTypedSelector((state) => state.adminPanel);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedIngredient, setSelectedIngredient] =
    useState<IComponent | null>(null);
  const [file, setFile] = useState<UploadFile | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchProviderBrands());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBrand) {
      dispatch(fetchProviderIngredients(selectedBrand));
    }
  }, [selectedBrand, dispatch]);

  const columns: TableProps<IComponent>['columns'] = [
    {
      title: 'Зображення',
      dataIndex: 'picture',
      key: 'picture',
      render: (picture: string) => (
        <Image
          width={50}
          height={50}
          src={picture}
          alt="Інгредієнт"
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
      title: 'Заклад',
      dataIndex: 'branded_store',
      key: 'branded_store',
      render: (branded_store: number) => {
        const brand = brands.find((brand) => brand.id === branded_store);
        return brand?.name || 'Невідомо';
      },
    },
    {
      title: 'Ціна',
      dataIndex: 'price',
      key: 'price',
      render: (text) => text + ' грн',
    },
    {
      title: 'Опція',
      dataIndex: 'options',
      key: 'options',
      render: (text) =>
        text === '*' ? (
          <p style={{ color: 'gray', fontStyle: 'italic' }}>Пусто</p>
        ) : (
          text
        ),
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="link"
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
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedIngredient(null);
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

  const onFinish = async (values: any) => {
    if (selectedBrand) {
      const formData = new FormData();
      formData.append('name', values.title);
      if (!selectedIngredient) {
        formData.append('branded_store_id', `${selectedBrand}`);
      }
      formData.append('price', values.price);

      if (values.option) {
        formData.append('options', values.option);
      } else {
        formData.append('options', '*');
      }

      if (file && file.originFileObj) {
        formData.append('picture', file.originFileObj);
      } else {
        message.error('Будь ласка, додайте зображення!');
        return;
      }

      try {
        if (selectedIngredient) {
          formData.append('id_ingredient', `${selectedIngredient.id}`);

          await dispatch(editIngredient(formData)).unwrap();
          message.success('Додавку успішно оновлено');
        } else {
          await dispatch(createNewIngredient(formData)).unwrap();
          message.success('Додавку успішно створено');
        }
        await dispatch(fetchProviderIngredients(selectedBrand));

        setIsModalOpen(false);
        setSelectedIngredient(null);
        form.resetFields();
        setFile(null);
      } catch (error) {
        message.error('Не вдалося зберегти добавку');
      }
    } else {
      message.warning('Виберіть заклад для створення добавки');
    }
  };

  const handleDelete = async (ingredientId: number) => {
    Modal.confirm({
      title: 'Ви впевнені, що хочете видалити категорію?',
      okText: 'Так',
      okType: 'danger',
      cancelText: 'Ні',
      onOk: async () => {
        try {
          if (selectedBrand) {
            await dispatch(
              deleteIngredient({
                menu_ingredients_id: ingredientId,
                branded_store_id: selectedBrand,
              })
            ).unwrap();
            message.success('Додавку успішно видалено');
            dispatch(fetchProviderIngredients(selectedBrand));
          }
        } catch (error) {
          message.error('Не вдалося видалити добавку');
        }
      },
    });
  };

  const handleEdit = (ingredient: IComponent) => {
    setSelectedIngredient(ingredient);
    setIsModalOpen(true);

    form.setFieldsValue({
      title: ingredient.name,
      price: ingredient.price,
      option: ingredient.options === '*' ? '' : ingredient.options,
    });

    const fileName =
      ingredient.name +
      '.' +
      (ingredient.picture.split('/').pop()?.split('.').pop() || 'jpg');

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
      url: ingredient.picture,
      originFileObj: fakeFile,
    };

    setFile(existingFile);
  };

  return (
    <>
      <Form layout="vertical">
        <Form.Item label="Заклад">
          <Select
            placeholder="Оберіть заклад"
            onChange={(value) => setSelectedBrand(value)}
            value={selectedBrand}
          >
            {brands &&
              brands.map((brand: IBrand) => (
                <Option key={brand.id} value={brand.id}>
                  {brand.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Form>

      {selectedBrand && (
        <Table<IComponent>
          columns={columns}
          dataSource={ingredients}
          pagination={false}
        />
      )}

      <Button type="primary" onClick={showModal} style={{ marginTop: '20px' }}>
        Створити добавку
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
            label="Ціна"
            name="price"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Ціна" type="number" />
          </Form.Item>
          <Form.Item label="Опція" name="option">
            <Input placeholder="Введіть опцію" />
          </Form.Item>
          <Form.Item
            label="Фото"
            name="file"
            rules={[{ required: !selectedIngredient, message: 'Додайте фото' }]}
          >
            <Upload.Dragger
              name="file"
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={file ? [file] : []}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Натисніть або перетягніть файл для завантаження
              </p>
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

export default ProviderIngredientsContent;
