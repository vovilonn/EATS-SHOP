import { ReactNode, useEffect, useState } from 'react';
import { Layout, Menu, Spin } from 'antd';
import { useRouter } from 'next/router';
import {
  UserOutlined,
  ShopOutlined,
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  FileOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import styles from './admin-layout.module.scss';

const { Header, Content, Footer, Sider } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setSavedToken(token);

    if (!token) {
      router.push('/admin/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    setSelectedKey(router.pathname);
  }, [router.pathname]);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      router.push(key);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/admin/login');
  };

  if (loading && !savedToken) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f0f2f5',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className={styles.adminLayout}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        collapsedWidth={80}
        className={styles.sider}
      >
        <div className={styles.logo}>{collapsed ? 'AP' : 'Admin Panel'}</div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[selectedKey]}
        >
          <Menu.Item key="/admin" icon={<DashboardOutlined />}>
            Главная
          </Menu.Item>
          <Menu.SubMenu
            key="structure"
            title="Структура"
            icon={<SettingOutlined />}
          >
            <Menu.Item
              key="/admin/add-new-product"
              icon={<PlusCircleOutlined />}
            >
              Добавить товар
            </Menu.Item>
            <Menu.Item key="/admin/edit-product" icon={<EditOutlined />}>
              Редактировать товар
            </Menu.Item>
            <Menu.Item key="/admin/city" icon={<UserOutlined />}>
              Город
            </Menu.Item>
            <Menu.Item key="/admin/brands" icon={<ShopOutlined />}>
              Магазин
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="/admin/roles" icon={<TeamOutlined />}>
            Роли
          </Menu.Item>
          <Menu.Item key="/admin/orders" icon={<FileOutlined />}>
            Заказы
          </Menu.Item>
          <Menu.Item key="/admin/clients" icon={<UserOutlined />}>
            Клиенты
          </Menu.Item>
          <Menu.Item key="/admin/promocodes" icon={<FileOutlined />}>
            Промокоды
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>Admin Panel</Header>
        <Content className={styles.content}>{children}</Content>
        <Footer className={styles.footer}>© 2024 Admin Panel</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
