import AdminLayout from '@/shared/layouts/admin-layout';
import ClientsPageContent from '@/shared/admin-pages-content/clients';

const ClientPage = () => {
  return (
    <AdminLayout>
      <ClientsPageContent />
    </AdminLayout>
  );
};

export default ClientPage;
