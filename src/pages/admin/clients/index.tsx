import AdminLayout from '@/shared/layouts/admin-layout';
import ClientsPageContent from '@/shared/admin-pages-content/clients';

const DashboardPage = () => {
  return (
    <AdminLayout>
      <ClientsPageContent />
    </AdminLayout>
  );
};

export default DashboardPage;
