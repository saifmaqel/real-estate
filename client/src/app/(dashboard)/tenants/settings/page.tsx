"use client";
import { AppLoader } from "@/components/AppLoader";
import SettingsForm from "@/components/SettingsForm";
import { SettingsFormData } from "@/lib/schemas";
import {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
} from "@/state/api";

function TenantSettings() {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateTenant] = useUpdateTenantSettingsMutation();

  if (isLoading) return <AppLoader />;

  const initialData: SettingsFormData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await updateTenant({ cognitoId: authUser?.cognitoInfo?.userId, ...data });
  };

  return (
    <SettingsForm
      userType={"tenant"}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
}

export default TenantSettings;
