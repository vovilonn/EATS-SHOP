import AdminLayout from '@/shared/layouts/admin-layout';
import BrandsPageContent from '@/shared/admin-pages-content/brands';

const DashboardPage = () => {
  return (
    <AdminLayout>
      <BrandsPageContent />
    </AdminLayout>
  );
};

export default DashboardPage;
