import AdminLayout from "@/shared/layouts/admin-layout";
import ClientsPageContent from "@/shared/pages-content/admin/clients";

const DashboardPage = () => {
  return (
    <AdminLayout>
      <ClientsPageContent/>
    </AdminLayout>
  );
};

export default DashboardPage;
