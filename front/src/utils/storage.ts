/**
 * Storage Helper for Remember Me functionality
 * Uses localStorage if rememberMe=true, otherwise sessionStorage
 */

class StorageHelper {
  private useLocalStorage: boolean;

  constructor() {
    // Check if user has "remember me" enabled
    this.useLocalStorage = localStorage.getItem('rememberMe') === 'true';
  }

  private getStorage(): Storage {
    return this.useLocalStorage ? localStorage : sessionStorage;
  }

  setRememberMe(remember: boolean) {
    this.useLocalStorage = remember;
    if (remember) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
  }

  setItem(key: string, value: string) {
    this.getStorage().setItem(key, value);
  }

  getItem(key: string): string | null {
    // Check both storages for backward compatibility
    return this.getStorage().getItem(key) || localStorage.getItem(key) || sessionStorage.getItem(key);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  clear() {
    sessionStorage.clear();
    // Don't clear localStorage completely, only auth-related items
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
}

export const storage = new StorageHelper();
