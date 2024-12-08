import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import {
  createGeneralCategory,
  deleteGeneralCategory,
  editGeneralCategory,
  fetchGeneralCategories,
} from '@/shared/store/admin/requests';

import ICategory from '@/shared/interfaces/category.interface';

import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Table,
  TableProps,
  Upload,
  UploadFile,
} from 'antd';

import { DeleteOutlined, EditOutlined, InboxOutlined } from '@ant-design/icons';

import Image from 'next/image';

const GeneralCategoriesContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<UploadFile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const dispatch = useDispatch<TypeDispatch>();
  const { generalCategories } = useTypedSelector((state) => state.adminPanel);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchGeneralCategories());
  }, [dispatch]);

  const columns: TableProps<ICategory>['columns'] = [
    {
      title: 'Зображення',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon: string) => (
        <Image
          width={50}
          height={50}
          src={icon}
          alt="Product"
          style={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      ),
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => name,
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    form.resetFields();
    setFile(null);
  };

  const handleDelete = (category_id: number) => {
    Modal.confirm({
      title: 'Ви впевнені, що хочете видалити цей продукт?',
      okText: 'Так',
      okType: 'danger',
      cancelText: 'Ні',
      onOk: async () => {
        try {
          await dispatch(deleteGeneralCategory(category_id)).unwrap();
          message.success('Категорію успішно видалено');
          dispatch(fetchGeneralCategories());
        } catch (error) {
          message.error('Не вдалося видалити категорію');
        }
      },
    });
  };

  const handleEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);

    form.setFieldsValue({
      title: category.name,
    });

    const existingFile: UploadFile = {
      uid: '-1',
      name: (category.name +
        '.' +
        category.icon.split('/').pop()?.split('.').pop()) as string,
      status: 'done',
      url: category.icon,
    };

    setFile(existingFile);
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('name', values.title);

    if (file && file.originFileObj) {
      formData.append('icon', file.originFileObj);
    } else {
      message.error('Будь ласка, додайте зображення!');
      return;
    }

    try {
      if (selectedCategory) {
        formData.append('category_id', `${selectedCategory.id}`);

        await dispatch(editGeneralCategory(formData)).unwrap();
        message.success('Категорію успішно змінено');
      } else {
        await dispatch(createGeneralCategory(formData)).unwrap();
        message.success('Категорію успішно створено');
      }
      await dispatch(fetchGeneralCategories());

      setIsModalOpen(false);
      form.resetFields();
      setFile(null);
      setSelectedCategory(null);
    } catch (error) {
      message.error('Помилка при створенні категорії');
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: '20px' }}
      >
        Створити нову категорію
      </Button>

      <Table<ICategory>
        columns={columns}
        dataSource={generalCategories}
        pagination={false}
        rowKey="id"
      />

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Назва"
            name="title"
            rules={[{ required: true, message: 'Заповніть це поле!' }]}
          >
            <Input placeholder="Введіть назву" />
          </Form.Item>
          <Form.Item label="Фото" name="file">
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

export default GeneralCategoriesContent;
