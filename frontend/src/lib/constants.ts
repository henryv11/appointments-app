export const SERVER_BASE_URL = 'http://localhost';

export const SERVER_WEBSOCKET_BASE_URL = SERVER_BASE_URL.replace(/^(http:\/\/)/, 'ws://');

export enum LocalStorageKey {
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum RoutePath {
  HOME = '/',
  PROFILE = '/profile',
  LOGIN = '/login',
  BOARDS = '/boards',
}
