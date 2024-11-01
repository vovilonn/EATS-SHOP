import AdminLayout from '@/shared/layouts/admin-layout';
import RolePageContent from '@/shared/admin-pages-content/roles';

const DashboardPage = () => {
  return (
    <AdminLayout>
      <RolePageContent />
    </AdminLayout>
  );
};

export default DashboardPage;
