import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';

import { Layout, Menu, Spin } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

import {
  UserOutlined,
  FileOutlined,
  LogoutOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  TagsOutlined,
} from '@ant-design/icons';

import styles from './admin-layout.module.scss';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { authToken, role } = useTypedSelector((state) => state.adminPanel);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const router = useRouter();
  const actions = useActions();

  useEffect(() => {
    if (typeof window !== 'undefined' && !authToken) {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        actions.setTokenAdmin(storedToken);
      } else {
        router.push('/admin/login');
      }
    } else {
      setLoading(false);
    }
  }, [authToken, router, actions]);

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
    actions.setAdminLogout();
    router.push('/admin/login');
  };

  if (loading && !authToken) {
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

  const menuItems = [
    {
      key: '/admin',
      icon: <HomeOutlined />,
      label: role === 'PROVIDER' ? 'Заклади' : 'Головна',
    },
    ...(role === 'ADMIN'
      ? [
          {
            key: '/admin/all-providers',
            icon: <TeamOutlined />,
            label: 'Всі провайдери',
          },
          {
            key: '/admin/general-categories',
            icon: <UnorderedListOutlined />,
            label: 'Основные категории',
          },
          {
            key: '/admin/clients',
            icon: <UserOutlined />,
            label: 'Клієнти',
          },
          {
            key: '/admin/promocodes',
            icon: <TagsOutlined />,
            label: 'Промокоди',
          },
        ]
      : []),
    ...(role === 'PROVIDER'
      ? [
          {
            key: '/admin/provider/categories',
            icon: <UserOutlined />,
            label: 'Категорії',
          },
          {
            key: '/admin/provider/ingredients',
            icon: <UserOutlined />,
            label: 'Додатки',
          },
          {
            key: '/admin/provider/products',
            icon: <UserOutlined />,
            label: 'Продукти',
          },
          {
            key: '/admin/orders',
            icon: <FileOutlined />,
            label: 'Замовлення',
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Вийти',
      onClick: handleLogout,
    },
  ];

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
        <div className={styles.logo}>{collapsed ? 'AP' : 'Адмін Панель'}</div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>Адмін Панель</Header>
        <Content className={styles.content}>{children}</Content>
        <Footer className={styles.footer}>© 2024 Адмін Панель</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
