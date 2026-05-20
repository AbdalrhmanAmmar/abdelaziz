import client from "./api";
import { IActivity } from "@crm/shared";

export const activityServices = {
  getAll: async () => {
    const response = await client.get("/activity");
    return response.data;
  },
  create: async (data: { actionType: string; description: string }) => {
    const response = await client.post("/activity", data);
    return response.data;
  },
};
