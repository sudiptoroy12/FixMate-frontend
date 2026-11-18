
import { authClient } from "../auth-client";

export const getTokenFromClient = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Unable to get authentication token.");
  }

   const token = data?.token;
  return token;
};