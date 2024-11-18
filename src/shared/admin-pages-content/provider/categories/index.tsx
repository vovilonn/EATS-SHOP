import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import ICategory, {
  IProviderCategory,
} from '@/shared/interfaces/category.interface';
import IBrand from '@/shared/interfaces/brand.interface';

import {
  createNewCategory,
  deleteCategory,
  editCategory,
  fetchProviderBrands,
  fetchProviderCategories,
} from '@/shared/store/admin/provider/requests';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  TableProps,
  Typography,
} from 'antd';

const { Option } = Select;

const ProviderCategoriesContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { brands, categories } = useTypedSelector((state) => state.adminPanel);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchProviderBrands());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBrand) {
      dispatch(fetchProviderCategories(selectedBrand));
    }
  }, [selectedBrand, dispatch]);

  const isEditing = (record: IProviderCategory) => record.id === editingKey;

  const edit = (record: IProviderCategory) => {
    form.setFieldsValue({ name: record.name });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(null);
    form.resetFields();
  };

  const save = async (id: number) => {
    try {
      const name = form.getFieldValue('name');

      await dispatch(editCategory({ category_id: id, name })).unwrap();
      message.success('Категория успешно обновлена');
      setEditingKey(null);
      if (selectedBrand) {
        dispatch(fetchProviderCategories(selectedBrand));
      }
    } catch (error) {
      message.error('Не удалось обновить категорию');
    }
  };

  const onFinish = async (values: any) => {
    if (selectedBrand) {
      const newCategory = {
        name: values.title,
        branded_store_id: selectedBrand,
      };
      try {
        await dispatch(createNewCategory(newCategory)).unwrap();
        message.success('Категория успешно создана');
        form.resetFields();
        setIsModalOpen(false);
        if (selectedBrand) {
          dispatch(fetchProviderCategories(selectedBrand));
        }
      } catch (error) {
        message.error('Не удалось создать категорию');
      }
    } else {
      message.warning('Выберите заведение для создания категории');
    }
  };

  const handleDelete = async (categoryId: number) => {
    Modal.confirm({
      title: 'Вы уверены, что хотите удалить категорию?',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk: async () => {
        try {
          await dispatch(deleteCategory(categoryId)).unwrap();
          message.success('Категория успешно удалена');
          if (selectedBrand) {
            dispatch(fetchProviderCategories(selectedBrand));
          }
        } catch (error) {
          message.error('Не удалось удалить категорию');
        }
      },
    });
  };

  const columns: TableProps<IProviderCategory>['columns'] = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: IProviderCategory) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="name"
              style={{ margin: 0 }}
              rules={[{ required: true, message: 'Заполните это поле!' }]}
            >
              <Input />
            </Form.Item>
          );
        }
        return record.name;
      },
    },
    {
      title: 'Заведение',
      dataIndex: 'branded_store_id',
      key: 'branded_store_id',
      render: (branded_store_id: number) => {
        const brand = brands.find((brand) => brand.id === branded_store_id);
        return brand?.name || 'Неизвестно';
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: IProviderCategory) => {
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
        <Form form={form} component={false}>
          <Table<IProviderCategory>
            columns={columns}
            dataSource={categories}
            pagination={false}
            rowClassName="editable-row"
          />
        </Form>
      )}
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginTop: '20px' }}
      >
        Создать категорию
      </Button>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Название"
            name="title"
            rules={[{ required: true, message: 'Заполните это поле!' }]}
          >
            <Input placeholder="Введите название" />
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

export default ProviderCategoriesContent;
