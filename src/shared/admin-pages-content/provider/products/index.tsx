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
  editProduct,
} from '@/shared/store/admin/provider/requests';
import { fetchGeneralCategories } from '@/shared/store/admin/requests';

import IBrand from '@/shared/interfaces/brand.interface';
import IComponent from '@/shared/interfaces/component.interface';
import IProduct, { IOption } from '@/shared/interfaces/product.interface';
import ICategory, {
  IProviderCategory,
} from '@/shared/interfaces/category.interface';

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
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [editing, setEditing] = useState(false);
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
      title: 'Зображення',
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
      title: 'Назва',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text,
    },
    {
      title: 'Заклад',
      dataIndex: 'model_branded_store',
      key: 'model_branded_store',
      render: (model_branded_store: IBrand) => {
        const brand = brands.find(
          (brand) => brand.id === model_branded_store.id
        );
        return brand?.name || 'Невідомо';
      },
    },
    {
      title: 'Основна категорія',
      dataIndex: 'model_general_categories',
      key: 'model_general_categories',
      render: (category: ICategory) => {
        return category?.name || 'Невідомо';
      },
    },
    {
      title: 'Категорія магазину',
      dataIndex: 'model_branded_store_categories',
      key: 'model_branded_store_categories',
      render: (category: IProviderCategory) => {
        return category?.name || 'Невідомо';
      },
    },
    {
      title: 'Склад',
      dataIndex: 'composition',
      key: 'composition',
      render: (record: string) => {
        return record || 'Невідомо';
      },
    },
    {
      title: 'Добавки',
      dataIndex: 'model_additional_components',
      key: 'model_additional_components',
      render: (ingredients: IComponent[]) => {
        if (ingredients.length) {
          return (
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
          );
        } else {
          return (
            <p style={{ color: 'gray', fontStyle: 'italic' }}>Добавок нету</p>
          );
        }
      },
    },
    {
      title: 'Опції',
      dataIndex: 'options',
      key: 'options',
      render: (_: any, record: IProduct) => (
        <Select
          placeholder="Виберіть опцію"
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
      title: 'Деталі опції',
      key: 'optionDetails',
      render: (_: any, record: IProduct) => {
        const selectedOption = selectedOptions[record.id];
        return selectedOption ? (
          <div>
            <p>Розмір: {selectedOption.name}</p>
            <p>Вага: {selectedOption.weight} г</p>
            <p>Ціна: {selectedOption.price} грн</p>
          </div>
        ) : (
          <span>Виберіть опцію</span>
        );
      },
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
    dispatch(fetchGeneralCategories());
    if (selectedBrand) {
      dispatch(fetchProviderCategories(selectedBrand));
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedProduct(null);
    setEditing(false);
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
    if (!file && !selectedProduct?.picture[0]) {
      message.error('Будь ласка, додайте зображення!');
      return;
    }

    const formData = new FormData();
    formData.append('name', values.title);
    formData.append('composition', values.composition);

    if (file) {
      formData.append('picture', file);
    } else if (selectedProduct?.picture) {
      formData.append('picture', selectedProduct.picture[0]);
    }

    formData.append('options', JSON.stringify(values.options));

    formData.append('general_categories_id', values.generalCategory);
    formData.append('branded_store_categories_id', values.category);
    if (values.ingredients && values.ingredients.length !== 0) {
      formData.append(
        'additional_components',
        JSON.stringify(values.ingredients)
      );
    }
    if (selectedBrand) {
      formData.append('branded_store_id', `${selectedBrand}`);
    }

    try {
      if (selectedProduct && editing) {
        formData.append('menu_id', `${selectedProduct.id}`);

        await dispatch(editProduct(formData)).unwrap();
        message.success('Продукт успішно оновлено');
      } else {
        await dispatch(createNewProduct(formData));
        message.success('Продукт успішно створено');
      }

      setIsModalOpen(false);
      form.resetFields();
      if (selectedBrand) {
        await dispatch(fetchProviderProducts(selectedBrand));
      }
    } catch (error) {
      message.error('Помилка при створенні продукту');
    }
  };

  const handleDelete = (productId: number) => {
    Modal.confirm({
      title: 'Ви впевнені, що хочете видалити цей продукт?',
      okText: 'Так',
      okType: 'danger',
      cancelText: 'Ні',
      onOk: async () => {
        try {
          if (selectedBrand) {
            await dispatch(
              deleteProduct({
                productId,
                brandId: selectedBrand,
              })
            ).unwrap();
            message.success('Продукт успішно видалено');
            dispatch(fetchProviderProducts(selectedBrand));
          }
        } catch (error) {
          message.error('Не вдалося видалити продукт');
        }
      },
    });
  };

  const handleEdit = (product: IProduct) => {
    dispatch(fetchGeneralCategories());
    if (selectedBrand) {
      dispatch(fetchProviderCategories(selectedBrand));
      dispatch(fetchProviderIngredients(selectedBrand));
    }

    setSelectedProduct(product);
    setEditing(true);

    form.setFieldsValue({
      title: product.name,
      composition: product.composition,
      options: product.options,
      generalCategory: product.model_general_categories?.id,
      category: product.model_branded_store_categories?.id,
      ingredients: product.model_additional_components.map(
        (component: IComponent) => component.id
      ),
      file: file ? file : product.picture[0],
    });

    setFile(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: '20px' }}
        disabled={!selectedBrand}
      >
        Створити новий продукт
      </Button>
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
            label="Назва"
            name="title"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Введіть назву" />
          </Form.Item>
          <Form.Item
            label="Склад"
            name="composition"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
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
                      rules={[{ required: true, message: 'Введіть опцію!' }]}
                    >
                      <Input placeholder="Опція" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'price']}
                      rules={[{ required: true, message: 'Вкажіть ціну!' }]}
                      normalize={(value) => Number(value)}
                    >
                      <Input placeholder="Ціна" type="number" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'weight']}
                      rules={[{ required: true, message: 'Вкажіть вагу!' }]}
                      normalize={(value) => Number(value)}
                    >
                      <Input placeholder="Вага" type="number" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      <DeleteOutlined />
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Додати опцію
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            label="Основна категорія"
            name="generalCategory"
            rules={[{ required: true, message: 'Оберіть основну категорію!' }]}
          >
            <Select placeholder="Оберіть основну категорію">
              {generalCategories &&
                generalCategories.map((item: ICategory) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Категорія закладу"
            name="category"
            rules={[{ required: true, message: 'Оберіть категорію!' }]}
          >
            <Select placeholder="Оберіть категорію">
              {categories &&
                categories.map((item: IProviderCategory) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Добавки" name="ingredients">
            <Select placeholder="Оберіть добавки" mode="multiple">
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
            rules={[{ required: true, message: 'Додайте фото' }]}
          >
            <Upload.Dragger
              name="file"
              beforeUpload={() => false}
              onChange={handleFileChange}
              defaultFileList={
                selectedProduct
                  ? [
                      {
                        uid: selectedProduct.id.toString(),
                        name: selectedProduct.name,
                        status: 'done',
                        url: selectedProduct.picture[0],
                      },
                    ]
                  : []
              }
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

export default ProviderProductsContent;
