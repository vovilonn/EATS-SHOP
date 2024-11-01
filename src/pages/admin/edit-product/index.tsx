import AdminLayout from '@/shared/layouts/admin-layout';
import EditProductPageContent from '@/shared/admin-pages-content/edit-product-page';

const AdminPage = () => {
  return (
    <AdminLayout>
      <EditProductPageContent />
    </AdminLayout>
  );
};

export default AdminPage;
