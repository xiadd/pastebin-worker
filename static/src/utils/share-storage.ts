export interface ShareItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'file';
  language?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'pastebin-shares';

export class ShareStorage {
  static getAll(): ShareItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading shares from localStorage:', error);
      return [];
    }
  }

  static save(item: Omit<ShareItem, 'id' | 'createdAt' | 'updatedAt'>): ShareItem {
    const shares = this.getAll();
    const now = new Date().toISOString();
    const newItem: ShareItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    
    shares.unshift(newItem);
    
    // 限制最多保存 100 个分享项目
    if (shares.length > 100) {
      shares.splice(100);
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shares));
      return newItem;
    } catch (error) {
      console.error('Error saving share to localStorage:', error);
      throw error;
    }
  }

  static update(id: string, updates: Partial<Omit<ShareItem, 'id' | 'createdAt'>>): ShareItem | null {
    const shares = this.getAll();
    const index = shares.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedItem = {
      ...shares[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    shares[index] = updatedItem;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shares));
      return updatedItem;
    } catch (error) {
      console.error('Error updating share in localStorage:', error);
      throw error;
    }
  }

  static delete(id: string): boolean {
    const shares = this.getAll();
    const filteredShares = shares.filter(item => item.id !== id);
    
    if (filteredShares.length === shares.length) {
      return false; // 没有找到要删除的项目
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredShares));
      return true;
    } catch (error) {
      console.error('Error deleting share from localStorage:', error);
      throw error;
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing shares from localStorage:', error);
      throw error;
    }
  }

  static getById(id: string): ShareItem | null {
    const shares = this.getAll();
    return shares.find(item => item.id === id) || null;
  }
}