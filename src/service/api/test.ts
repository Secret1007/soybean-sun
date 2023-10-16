import { request } from "../request";

export const testErrorMessage = () => {
  return request.post("/policy/legalperson/dict");
};
