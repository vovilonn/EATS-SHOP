import AdminLayout from "@/shared/layouts/admin-layout";
import OrdersPageContent from "@/shared/pages-content/admin/orders";

const OrdersPage = () => {
  return (
    <AdminLayout>
      <OrdersPageContent />
    </AdminLayout>
  );
};

export default OrdersPage;
