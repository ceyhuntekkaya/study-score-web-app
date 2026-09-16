import configData from './config.json';

interface Config {
  api: {
    invokeUrl: string;
    baseUrl: string;
    aiUrl: string;
    aiUrl2?: string;
    stt?: string;
    tts: string;
    ollamaUser: string;
    ollamaPass: string;
    ollamaModel: string;
  };
}

const config: Config = configData as Config;

export const getConfig = (): Config => config;

export const getApiInvokeUrl = (): string => config.api.invokeUrl;
export const getApiBaseUrl = (): string => config.api.baseUrl;
export const getApiAiUrl = (): string => config.api.aiUrl;
export const getTtsUrl = (): string => config.api.tts;
export const getOllamaUser = (): string => config.api.ollamaUser;
export const getOllamaPass = (): string => config.api.ollamaPass;
export const getOllamaModel = (): string => config.api.ollamaModel;

export default config;
