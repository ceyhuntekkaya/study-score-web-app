import configData from './config.json';

interface Config {
  api: {
    invokeUrl: string;
    baseUrl: string;
    aiUrl: string;
    tts: string;
  };
}

const config: Config = configData as Config;

export const getConfig = (): Config => config;

export const getApiInvokeUrl = (): string => config.api.invokeUrl;
export const getApiBaseUrl = (): string => config.api.baseUrl;
export const getApiAiUrl = (): string => config.api.aiUrl;
export const getTtsUrl = (): string => config.api.tts;

export default config;
