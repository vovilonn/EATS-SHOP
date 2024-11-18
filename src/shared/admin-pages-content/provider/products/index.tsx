import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import {
  fetchProviderBrands,
  fetchProviderCategories,
  fetchProviderIngredients,
  fetchProviderProducts,
  createNewProduct,
  deleteProduct,
} from '@/shared/store/admin/provider/requests';
import { fetchGeneralCategories } from '@/shared/store/admin/requests';

import IBrand from '@/shared/interfaces/brand.interface';
import IComponent from '@/shared/interfaces/component.interface';
import IProduct, { IOption } from '@/shared/interfaces/product.interface';
import ICategory, {
  IProviderCategory,
} from '@/shared/interfaces/category.interface';

import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';

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
import TextArea from 'antd/es/input/TextArea';

import Image from 'next/image';

const { Option } = Select;

const ProviderProductsContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { products, brands, generalCategories, categories, ingredients } =
    useTypedSelector((state) => state.adminPanel);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: IOption | null;
  }>({});
  const [file, setFile] = useState<File | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchProviderBrands());
    if (selectedBrand) {
      dispatch(fetchProviderProducts(selectedBrand));
      dispatch(fetchProviderIngredients(selectedBrand));
    }
  }, [dispatch, selectedBrand]);

  const columns: TableProps<IProduct>['columns'] = [
    {
      title: 'Изображение',
      dataIndex: 'picture',
      key: 'picture',
      render: (picture: string[]) => (
        <Image
          width={50}
          height={50}
          src={picture[0]}
          alt="Product"
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
      dataIndex: 'model_branded_store',
      key: 'model_branded_store',
      render: (model_branded_store: IBrand) => {
        const brand = brands.find(
          (brand) => brand.id === model_branded_store.id
        );
        return brand?.name || 'Неизвестно';
      },
    },
    {
      title: 'Основная категория',
      dataIndex: 'model_general_categories',
      key: 'model_general_categories',
      render: (category: ICategory) => {
        return category?.name || 'Неизвестно';
      },
    },
    {
      title: 'Категория магазина',
      dataIndex: 'model_branded_store_categories',
      key: 'model_branded_store_categories',
      render: (category: IProviderCategory) => {
        return category?.name || 'Неизвестно';
      },
    },
    {
      title: 'Состав',
      dataIndex: 'composition',
      key: 'composition',
      render: (record: string) => {
        return record || 'Неизвестно';
      },
    },
    {
      title: 'Добавки',
      dataIndex: 'model_additional_components',
      key: 'model_additional_components',
      render: (ingredients: IComponent[]) => (
        <Select
          value={ingredients.length > 0 ? ingredients[0].id : undefined}
          style={{ width: 120 }}
        >
          {ingredients.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Опции',
      dataIndex: 'options',
      key: 'options',
      render: (_: any, record: IProduct) => (
        <Select
          placeholder="Выберите опцию"
          onChange={(value) => handleOptionChange(record.id, value)}
          style={{ width: 120 }}
        >
          {record.options.map((option) => (
            <Option key={option.id} value={option.id}>
              {option.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Детали опции',
      key: 'optionDetails',
      render: (_: any, record: IProduct) => {
        const selectedOption = selectedOptions[record.id];
        return selectedOption ? (
          <div>
            <p>Размер: {selectedOption.name}</p>
            <p>Вес: {selectedOption.weight} г</p>
            <p>Цена: {selectedOption.price} грн</p>
          </div>
        ) : (
          <span>Выберите опцию</span>
        );
      },
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
        </>
      ),
    },
  ];

  const showModal = () => {
    dispatch(fetchGeneralCategories());
    if (selectedBrand) {
      dispatch(fetchProviderCategories(selectedBrand));
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFileChange = (info: any) => {
    setFile(info.file);
  };

  const handleOptionChange = (productId: number, optionId: number) => {
    const selectedOption =
      products
        .find((item) => item.id === productId)
        ?.options.find((option) => option.id === optionId) || null;
    setSelectedOptions((prev) => ({ ...prev, [productId]: selectedOption }));
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('name', values.title);
    formData.append('composition', values.composition);
    formData.append('picture', file as Blob);

    formData.append('options', JSON.stringify(values.options));

    formData.append('general_categories_id', values.generalCategory);
    formData.append('branded_store_categories_id', values.category);
    formData.append('additional_components', `${values.ingredients}`);
    if (selectedBrand) {
      formData.append('branded_store_id', `${selectedBrand}`);
    }

    try {
      await dispatch(createNewProduct(formData));
      setIsModalOpen(false);
      form.resetFields();
      if (selectedBrand) {
        await dispatch(fetchProviderProducts(selectedBrand));
      }
      message.success('Продукт успешно создан');
    } catch (error) {
      message.error('Ошибка при создании продукта');
    }
  };

  const handleDelete = (productId: number) => {
    Modal.confirm({
      title: 'Вы уверены, что хотите удалить этот продукт?',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk: async () => {
        try {
          if (selectedBrand) {
            await dispatch(
              deleteProduct({
                productId,
                brandId: selectedBrand,
              })
            ).unwrap();
            message.success('Продукт успешно удалена');
            dispatch(fetchProviderProducts(selectedBrand));
          }
        } catch (error) {
          message.error('Не удалось удалить продукт');
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
        disabled={!selectedBrand}
      >
        Создать новый продукт
      </Button>
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
        <Table<IProduct>
          columns={columns}
          dataSource={products}
          pagination={false}
          scroll={{ x: 1500 }}
        />
      )}

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Название"
            name="title"
            rules={[{ required: true, message: 'Заполните это поле!' }]}
          >
            <Input placeholder="Введите название" />
          </Form.Item>
          <Form.Item
            label="Состав"
            name="composition"
            rules={[{ required: true, message: 'Заполните это поле!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Введите опцию!' }]}
                    >
                      <Input placeholder="Опция" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'price']}
                      rules={[{ required: true, message: 'Укажите цену!' }]}
                      normalize={(value) => Number(value)}
                    >
                      <Input placeholder="Цена" type="number" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'weight']}
                      rules={[{ required: true, message: 'Укажите вес!' }]}
                      normalize={(value) => Number(value)}
                    >
                      <Input placeholder="Вес" type="number" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      <DeleteOutlined />
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Добавить опцию
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            label="Основная категория"
            name="generalCategory"
            rules={[
              { required: true, message: 'Выберите основную категорию!' },
            ]}
          >
            <Select placeholder="Выберите основную категорию">
              {generalCategories &&
                generalCategories.map((item: ICategory) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Категория заведения"
            name="category"
            rules={[{ required: true, message: 'Выберите категорию!' }]}
          >
            <Select placeholder="Выберите категорию">
              {categories &&
                categories.map((item: IProviderCategory) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Добавки"
            name="ingredients"
            rules={[{ required: true, message: 'Выберите добавки!' }]}
          >
            <Select placeholder="Выберите добавки" mode="multiple">
              {ingredients &&
                ingredients.map((item: IComponent) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
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

export default ProviderProductsContent;
