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
  fetchProviderGeneralCategories,
  editPositionForProduct,
} from '@/shared/store/admin/provider/requests';

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
  UploadFile,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';

import Image from 'next/image';
import { RcFile } from 'antd/es/upload';

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
  const [file, setFile] = useState<UploadFile | null>(null);

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
      title: 'Позиция',
      dataIndex: 'position',
      key: 'position',
      render: (position: number, record: IProduct) => (
        <Select
          value={position}
          style={{ width: 70 }}
          onChange={(value) => handlePositionChange(record.id, value)}
          options={Array.from({ length: products.length }, (_, i) => ({
            value: i + 1,
            label: i + 1,
          }))}
        />
      ),
    },
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
      render: () => {
        const brand = brands.find((brand) => brand.id === selectedBrand);

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
        return (
          record || (
            <span style={{ color: 'gray', fontStyle: 'italic' }}>Пусто</span>
          )
        );
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
            {selectedOption.weight && <p>Вага: {selectedOption.weight} г</p>}
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

  const handlePositionChange = async (id: number, newPosition: number) => {
    try {
      Modal.confirm({
        title: 'Ви дійсно хочете змінити позицію продукту?',
        okText: 'Так',
        okType: 'danger',
        cancelText: 'Ні',
        onOk: async () => {
          await dispatch(
            editPositionForProduct({ menu_id: id, position: newPosition })
          );
          message.success('Позиція продукту успішно оновлена');
          if (selectedBrand) {
            await dispatch(fetchProviderProducts(selectedBrand));
          }
        },
      });
    } catch (error) {
      message.error('Не вдалося оновити позицію продукту');
    }
  };

  const showModal = () => {
    dispatch(fetchProviderGeneralCategories());
    if (selectedBrand) {
      dispatch(fetchProviderCategories(selectedBrand));
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
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

  const handleOptionChange = (productId: number, optionId: number) => {
    const selectedOption =
      products
        .find((item) => item.id === productId)
        ?.options.find((option) => option.id === optionId) || null;
    setSelectedOptions((prev) => ({ ...prev, [productId]: selectedOption }));
  };

  const handleSubmit = async (values: any) => {
    console.log('values', values);

    const formData = new FormData();
    formData.append('name', values.title);

    if (values.composition) {
      formData.append('composition', values.composition);
    }

    if (file && file.originFileObj) {
      formData.append('picture', file.originFileObj);
    } else {
      message.error('Будь ласка, додайте зображення!');
      return;
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
      if (selectedProduct) {
        formData.append('menu_id', `${selectedProduct.id}`);

        await dispatch(editProduct(formData)).unwrap();
        message.success('Продукт успішно оновлено');
      } else {
        await dispatch(createNewProduct(formData));
        message.success('Продукт успішно створено');
      }
      if (selectedBrand) {
        await dispatch(fetchProviderProducts(selectedBrand));
      }

      setIsModalOpen(false);
      form.resetFields();
      setSelectedProduct(null);
      setFile(null);
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
    dispatch(fetchProviderGeneralCategories());
    if (selectedBrand) {
      dispatch(fetchProviderCategories(selectedBrand));
      dispatch(fetchProviderIngredients(selectedBrand));
    }

    setSelectedProduct(product);
    setIsModalOpen(true);

    form.setFieldsValue({
      title: product.name,
      composition: product.composition ? product.composition : '',
      options: product.options,
      generalCategory: product.model_general_categories?.id,
      category: product.model_branded_store_categories?.id,
      ingredients: product.model_additional_components.map(
        (component: IComponent) => component.id
      ),
    });

    const fileName =
      product.name +
      '.' +
      (product.picture[0].split('/').pop()?.split('.').pop() || 'jpg');

    const fakeFile: RcFile = {
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
    };

    const existingFile: UploadFile = {
      uid: '-1',
      name: fileName,
      status: 'done',
      url: product.picture[0],
      originFileObj: fakeFile,
    };

    setFile(existingFile);
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
          rowKey="id"
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
          <Form.Item label="Склад" name="composition">
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
            rules={[{ required: !selectedProduct, message: 'Додайте фото' }]}
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

export default ProviderProductsContent;
