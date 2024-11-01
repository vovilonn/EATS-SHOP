import AdminLayout from '@/shared/layouts/admin-layout';
import CityPageContent from '@/shared/admin-pages-content/city';

const DashboardPage = () => {
  return (
    <AdminLayout>
      <CityPageContent />
    </AdminLayout>
  );
};

export default DashboardPage;
