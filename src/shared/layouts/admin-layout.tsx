import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';

import { Layout, Menu, Spin } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  TagsOutlined,
  FilterOutlined,
  ShoppingOutlined,
  FileDoneOutlined,
  SettingOutlined,
  WalletOutlined,
} from '@ant-design/icons';

import styles from './admin-layout.module.scss';
import {fetchProviderOrders} from "@/shared/store/admin/provider/requests";
import {useDispatch} from "react-redux";
import {TypeDispatch} from "@/shared/store";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { authToken, role, isSoundPlayed } = useTypedSelector((state) => state.adminPanel);

  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const dispatch = useDispatch<TypeDispatch>();

  const router = useRouter();
  const actions = useActions();

  useEffect(() => {
    dispatch(fetchProviderOrders());

    const interval = setInterval(() => {
      dispatch(fetchProviderOrders());
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const playAudio = () => {
      const audio = new Audio('/sounds/notification.mp3');
      audio
        .play()
        .catch((error) =>
          console.error('Ошибка воспроизведения звука:', error)
        );
    };

    if (isSoundPlayed) {
      interval = setInterval(playAudio, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    }
  }, [isSoundPlayed]);

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
          {
            key: '/admin/cashback',
            icon: <WalletOutlined />,
            label: 'Кэшбек',
          },
          {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: 'Настройки',
          },
        ]
      : []),
    ...(role === 'PROVIDER'
      ? [
          {
            key: '/admin/provider/categories',
            icon: <UnorderedListOutlined />,
            label: 'Категорії',
          },
          {
            key: '/admin/provider/ingredients',
            icon: <FilterOutlined />,
            label: 'Додатки',
          },
          {
            key: '/admin/provider/products',
            icon: <ShoppingOutlined />,
            label: 'Продукти',
          },
          {
            key: '/admin/orders',
            icon: <FileDoneOutlined />,
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

  const siderWidth = collapsed ? 80 : 250;

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
      <Layout className={styles.mainLayout} style={{ marginLeft: siderWidth }}>
        <Header className={styles.header}>Адмін Панель</Header>
        <Content className={styles.content}>{children}</Content>
        <Footer className={styles.footer}>© 2024 Адмін Панель</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
