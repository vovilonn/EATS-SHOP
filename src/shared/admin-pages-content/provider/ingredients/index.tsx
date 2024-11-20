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
} from 'antd';
import Image from 'next/image';

const { Option } = Select;

const ProviderIngredientsContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { brands, ingredients } = useTypedSelector((state) => state.adminPanel);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedIngredient, setSelectedIngredient] =
    useState<IComponent | null>(null);
  const [file, setFile] = useState<File | null>(null);

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
      title: 'Изображение',
      dataIndex: 'picture',
      key: 'picture',
      render: (picture: string) => (
        <Image
          width={50}
          height={50}
          src={picture}
          alt="Ingredient"
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
      title: 'Заведение',
      dataIndex: 'branded_store',
      key: 'branded_store',
      render: (branded_store: number) => {
        const brand = brands.find((brand) => brand.id === branded_store);
        return brand?.name || 'Неизвестно';
      },
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (text) => text + ' грн',
    },
    {
      title: 'Опция',
      dataIndex: 'options',
      key: 'options',
      render: (text) => text,
    },
    {
      title: 'Действия',
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
    form.resetFields();
  };

  const handleFileChange = (info: any) => {
    setFile(info.file);
  };

  const onFinish = async (values: any) => {
    if (!file && !selectedIngredient?.picture) {
      message.error('Пожалуйста, добавьте изображение!');
      return;
    }

    if (selectedBrand) {
      const formData = new FormData();
      formData.append('name', values.title);
      if (!selectedIngredient) {
        formData.append('branded_store_id', `${selectedBrand}`);
      }
      formData.append('price', values.price);
      formData.append('options', values.option);

      if (file) {
        formData.append('picture', file);
      } else if (selectedIngredient?.picture) {
        formData.append('picture', selectedIngredient.picture);
      }

      try {
        if (selectedIngredient) {
          formData.append('id_ingredient', `${selectedIngredient.id}`);

          await dispatch(editIngredient(formData)).unwrap();
          message.success('Добавка успешно обновлена');
        } else {
          await dispatch(createNewIngredient(formData)).unwrap();
          message.success('Добавка успешно создана');
        }

        form.resetFields();
        setIsModalOpen(false);
        dispatch(fetchProviderIngredients(selectedBrand));
      } catch (error) {
        message.error('Не удалось сохранить добавку');
      }
    } else {
      message.warning('Выберите заведение для создания добавки');
    }
  };

  const handleDelete = async (ingredientId: number) => {
    Modal.confirm({
      title: 'Вы уверены, что хотите удалить категорию?',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk: async () => {
        try {
          if (selectedBrand) {
            await dispatch(
              deleteIngredient({
                menu_ingredients_id: ingredientId,
                branded_store_id: selectedBrand,
              })
            ).unwrap();
            message.success('Добавка успешно удалена');
            dispatch(fetchProviderIngredients(selectedBrand));
          }
        } catch (error) {
          message.error('Не удалось удалить добавку');
        }
      },
    });
  };

  const handleEdit = (ingredient: IComponent) => {
    setSelectedIngredient(ingredient);
    form.setFieldsValue({
      title: ingredient.name,
      price: ingredient.price,
      option: ingredient.options,
      file: ingredient.picture,
    });
    setFile(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <Form layout="vertical">
        <Form.Item label="Заведение">
          <Select
            placeholder="Выберите заведение"
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
        Создать добавку
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
            label="Цена"
            name="price"
            rules={[{ required: true, message: 'Заполните это поле!' }]}
          >
            <Input placeholder="Цена" type="number" />
          </Form.Item>
          <Form.Item
            label="Опция"
            name="option"
            rules={[{ required: true, message: 'Заполните это поле!' }]}
          >
            <Input placeholder="Введите опцию" />
          </Form.Item>
          <Form.Item
            label="Фото"
            name="file"
            rules={[{ required: true, message: 'Добавьте фото' }]}
          >
            <Upload.Dragger
              name="file"
              beforeUpload={() => false}
              onChange={handleFileChange}
              defaultFileList={
                selectedIngredient
                  ? [
                      {
                        uid: selectedIngredient.id.toString(),
                        name: selectedIngredient.name,
                        status: 'done',
                        url: selectedIngredient.picture,
                      },
                    ]
                  : []
              }
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Нажмите или перетащите файл для загрузки
              </p>
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

export default ProviderIngredientsContent;
