"use client";
import { AppLoader } from "@/components/AppLoader";
import SettingsForm from "@/components/SettingsForm";
import { SettingsFormData } from "@/lib/schemas";
import {
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation,
} from "@/state/api";

function ManagerSettings() {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateManager] = useUpdateManagerSettingsMutation();

  if (isLoading) return <AppLoader />;

  const initialData: SettingsFormData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await updateManager({ cognitoId: authUser?.cognitoInfo?.userId, ...data });
  };

  return (
    <SettingsForm
      userType={"manager"}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
}

export default ManagerSettings;
