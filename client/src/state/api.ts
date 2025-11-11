import { createNewUserInDatabase } from "@/lib/utils";
import { Manager, Tenant } from "@/types/prismaTypes";
import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;

      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
    },
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_arg, _api, _extraOptions, fetchWithBaseQuery) => {
        try {
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken;
          const user = await getCurrentUser();

          const userRole = idToken?.payload["custom:role"] as UserRole;

          const endpoint =
            userRole === "manager"
              ? `manager/${user.userId}`
              : `tenants/${user.userId}`;

          let userDetailsResponse = await fetchWithBaseQuery(endpoint);

          if (
            userDetailsResponse.error &&
            userDetailsResponse.error.status === 404
          ) {
            userDetailsResponse = await createNewUserInDatabase(
              user,
              idToken,
              userRole,
              fetchWithBaseQuery as (
                arg: string | FetchArgs
              ) => Promise<
                QueryReturnValue<
                  unknown,
                  FetchBaseQueryError,
                  FetchBaseQueryMeta
                >
              >
            );
          }

          if (userDetailsResponse.error) throw new Error("General Error");

          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsResponse.data as Tenant | Manager,
              userRole,
            },
          };
        } catch (error) {
          return {
            error: {
              status: 500,
              data:
                error instanceof Error
                  ? error.message
                  : "Could not fetch user data",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetAuthUserQuery } = api;
