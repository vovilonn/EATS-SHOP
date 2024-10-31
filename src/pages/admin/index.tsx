import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import AdminLayout from '@/shared/layouts/admin-layout';
import AdminPageContent from '@/shared/pages-content/admin';
import LoginPageContent from '@/shared/pages-content/login';
import { Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const AdminPage = () => {
  const savedToken =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!savedToken) {
      router.push('/admin/login').finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [savedToken, router]);

  if (loading) {
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
    <>
      {!savedToken ? (
        <LoginPageContent />
      ) : (
        <AdminLayout>
          <AdminPageContent />
        </AdminLayout>
      )}
    </>
  );
};

export default AdminPage;
