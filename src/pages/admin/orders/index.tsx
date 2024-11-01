import AdminLayout from '@/shared/layouts/admin-layout';
import OrdersPageContent from '@/shared/admin-pages-content/orders';

const OrdersPage = () => {
  return (
    <AdminLayout>
      <OrdersPageContent />
    </AdminLayout>
  );
};

export default OrdersPage;
