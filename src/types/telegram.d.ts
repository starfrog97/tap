export {};

declare global {
  interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  }

  interface TelegramWebAppData {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  }

  interface TelegramWebApp {
    initDataUnsafe: TelegramWebAppData;
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
