type ServiceEnv = Record<ServiceEnvType, ServiceEnvConfig>;

const serviceEnv: ServiceEnv = {
  dev: {
    url: "http://172.26.64.155:8089/jc",
  },
  test: {
    url: "http://localhost:8080",
  },
  prod: {
    url: "http://localhost:8080",
  },
};
/**
 * 获取当前环境模式下的请求服务的配置
 * @param env 环境
 * @returns
 */
export function getServiceEnvConfig(
  env: ImportMetaEnv
): ServiceEnvConfigWithProxyPattern {
  const { VITE_SERVICE_ENV = "dev" } = env;
  const config = serviceEnv[VITE_SERVICE_ENV];
  return {
    ...config,
    proxyPattern: "/proxy-pattern",
  };
}
