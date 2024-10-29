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
  BarChartOutlined 
} from '@ant-design/icons';
import styles from './admin-layout.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { IInitialState } from '../store/admin';
import { useTypedSelector } from '../hooks/use-typed-selector';

const { Header, Content, Footer, Sider } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true); // Состояние для загрузки

  // Получаем токен из Redux
  const {tokenAdmin} = useTypedSelector((state) => state.authAdmin);
  
  useEffect(() => {
    // Инициализация выбранного ключа меню
    setSelectedKey(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    // Проверка токена при загрузке компонента
    const savedToken = localStorage.getItem('authToken');

    if (!tokenAdmin && !savedToken) {
      // Если токен отсутствует, перенаправляем на /admin/login
      router.push('/admin/login');
    } else if (savedToken && !tokenAdmin) {
      // Если токен есть в localStorage, сохраняем его в Redux
      dispatch({ type: 'SAVE_TOKEN', payload: savedToken });
    }

    // Убираем индикатор загрузки после завершения проверки
    setLoading(false);
  }, [tokenAdmin, router, dispatch]);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      router.push(key);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Удаляем токен из localStorage
    router.push('/admin/login'); // Перенаправляем на страницу входа
  };

  // Показываем индикатор загрузки, если идет проверка токена
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Загрузка..." />
      </div>
    );
  }

  // Если авторизация пройдена, рендерим страницу админки
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
          <Menu.Item key="/admin/main" icon={<DashboardOutlined />}>Главная</Menu.Item>
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
