const API_URL = import.meta.env.VITE_API_URL;

export const getCleanApiBase = () => API_URL.replace(/\/api$/, "");

export const buildApiEndpoint = (path) =>
  `${getCleanApiBase()}/api${path}`;

export const buildFileUrl = (relativePath) =>
  `${getCleanApiBase()}/${relativePath}`;
