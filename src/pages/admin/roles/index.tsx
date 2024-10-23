import AdminLayout from "@/shared/layouts/admin-layout";
import RolesPageContent from "@/shared/pages-content/admin/roles/index";

const DashboardPage = () => {
  return (
    <AdminLayout>
      <RolesPageContent />
    </AdminLayout>
  );
};

export default DashboardPage;
