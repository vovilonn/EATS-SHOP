import AdminLayout from '@/shared/layouts/admin-layout';
import PromocodesPageContent from '@/shared/admin-pages-content/promocodes';

const DashboardPage = () => {
  return (
    <AdminLayout>
      <PromocodesPageContent />
    </AdminLayout>
  );
};

export default DashboardPage;
