import "@testing-library/jest-dom";

class MemoryStorage {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  get length() {
    return Object.keys(this.store).length;
  }
  key(index) {
    return Object.keys(this.store)[index] || null;
  }
}

const mockLocalStorage = new MemoryStorage();
const mockSessionStorage = new MemoryStorage();

// Override global and window properties
try {
  Object.defineProperty(global, "localStorage", {
    value: mockLocalStorage,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(global, "sessionStorage", {
    value: mockSessionStorage,
    writable: true,
    configurable: true,
  });
} catch (e) {}

if (typeof window !== "undefined") {
  try {
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage,
      writable: true,
      configurable: true,
    });
  } catch (e) {}
}
