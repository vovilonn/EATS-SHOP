import AdminLayout from '@/shared/layouts/admin-layout';
import AddNewProductPageContent from '@/shared/admin-pages-content/add-new-product-page';

const MenuPage = () => {
  return (
    <AdminLayout>
      <AddNewProductPageContent />
    </AdminLayout>
  );
};

export default MenuPage;
