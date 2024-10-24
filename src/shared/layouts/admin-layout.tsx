import { ReactNode, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
import { 
  UserOutlined, 
  ShopOutlined, 
  DashboardOutlined, 
  TeamOutlined, 
  SettingOutlined, 
  FileOutlined, 
  LogoutOutlined, 
  BarChartOutlined 
} from '@ant-design/icons';
import styles from './admin-layout.module.scss';
import { useSelector } from 'react-redux';
import { IInitialState } from '../store/admin';

const { Header, Content, Footer, Sider } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const tokenAdmin = useSelector<IInitialState>((state) => state.tokenAdmin);

  useEffect(() => {
    setSelectedKey(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    if (!tokenAdmin) {
      // router.push("/admin/login")
    }
    console.log("LOG TOKEN", tokenAdmin);
    
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      router.push(key);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  return (
    <Layout className={styles.adminLayout}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}  // Ширина в развернутом виде
        collapsedWidth={80}  // Ширина в свернутом виде
        className={styles.sider}
      >
        <div className={styles.logo}>{collapsed ? 'AP' : 'Admin Panel'}</div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[selectedKey]}
        >
          <Menu.SubMenu key="structure" title="Структура" icon={<SettingOutlined />}>
            <Menu.Item key="/admin/general" icon={<DashboardOutlined />}>Общая инфо</Menu.Item>
            <Menu.Item key="/admin/general/city" icon={<UserOutlined />}>Город</Menu.Item>
            <Menu.Item key="/admin/general/brands" icon={<ShopOutlined />}>Магазин</Menu.Item>
            <Menu.Item key="/admin/general/menu" icon={<FileOutlined />}>Меню</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="/admin/roles" icon={<TeamOutlined />}>Роли</Menu.Item>
          <Menu.Item key="/admin/orders" icon={<FileOutlined />}>Заказы</Menu.Item>
          <Menu.Item key="/admin/clients" icon={<UserOutlined />}>Клиенты</Menu.Item>
          <Menu.Item key="/admin/promocodes" icon={<FileOutlined />}>Промокоды</Menu.Item>
          <Menu.Item key="/admin/main" icon={<DashboardOutlined />}>Главная</Menu.Item>
          <Menu.Item key="/admin/main/statistics" icon={<BarChartOutlined />}>Статистика</Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
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
