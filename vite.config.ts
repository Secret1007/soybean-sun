import { defineConfig, loadEnv } from "vite";
import { getRootPath, getSrcPath } from "./build";
import { setupVitePlugins } from "./build";

export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(
    configEnv.mode,
    process.cwd()
  ) as unknown as ImportMetaEnv;
  const rootPath = getRootPath();
  const srcPath = getSrcPath();
  return {
    resolve: {
      alias: {
        "~": rootPath,
        "@": srcPath,
      },
    },
    plugins: [setupVitePlugins(viteEnv)],
  };
});
