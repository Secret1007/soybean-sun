import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import type { AxiosResponse } from "axios";
import { REFRESH_TOKEN_CODE } from "~/src/config";
import {
  handleAxiosError,
  handleBackendError,
} from "~/src/utils/service/error";
import { handleServiceResult } from "~/src/utils/service/handler";
import { transformRequestData } from "~/src/utils/service/transform";
import { localStg } from "~/src/utils/storage/local";

type RefreshRequestQueue = (config: AxiosRequestConfig) => void;

export default class CustomAxiosInstance {
  instance: AxiosInstance;

  backendConfig: Service.BackendResultConfig;

  isRefreshing: boolean;

  retryQueues: RefreshRequestQueue[];

  constructor(
    axiosConfig: AxiosRequestConfig,
    backendConfig: Service.BackendResultConfig = {
      codeKey: "code",
      dataKey: "data",
      msgKey: "message",
      successCode: 200,
    }
  ) {
    this.instance = axios.create(axiosConfig);
    this.backendConfig = backendConfig;
    this.setInterceptor();
    this.isRefreshing = false;
    this.retryQueues = [];
  }

  /** 设置请求拦截器 */
  setInterceptor() {
    this.instance.interceptors.request.use(
      async (config) => {
        const handleConfig = { ...config };
        if (handleConfig.headers) {
          // 数据转换
          const contentType = handleConfig.headers[
            "Content-Type"
          ] as UnionKey.ContentType;
          handleConfig.data = await transformRequestData(
            handleConfig.data,
            contentType
          );
          // 设置token
          handleConfig.headers.Authorization = localStg.get("token") || "";
        }
        return handleConfig;
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null);
      }
    );

    this.instance.interceptors.response.use(
      async (response) => {
        const { status, config } = response;
        if (status === 200 || status < 300 || status === 304) {
          const backend = response.data;
          const { codeKey, dataKey, successCode } = this.backendConfig;
          // 请求成功
          if (backend[codeKey] === successCode) {
            return handleServiceResult(null, backend[dataKey]);
          }

          // token失效，刷新token
          if (REFRESH_TOKEN_CODE.includes(backend[codeKey])) {
            // 原始请求
            const originRequest = new Promise((resolve) => {
              this.retryQueues.push((refreshConfig: AxiosRequestConfig) => {
                config.headers.Authorization =
                  refreshConfig.headers?.Authorization;
                resolve(this.instance.request(config));
              });
            });

            // if (!this.isRefreshing) {
            //   this.isRefreshing = true;
            //   // const refreshConfig = await handleRefreshToken(response.config);
            //   // TODO:
            // }

            const error = handleBackendError(backend, this.backendConfig);
            return handleServiceResult(error, null);
          }
        }
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null);
      }
    );
  }
}
