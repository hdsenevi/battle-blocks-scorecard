// Jest setup file
// Note: @testing-library/react-native v13+ automatically extends Jest matchers
// No need to import extend-expect

// Mock TurboModuleRegistry before React Native loads
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn(() => ({
    show: jest.fn(),
    getConstants: jest.fn(() => ({})),
  })),
  get: jest.fn(() => null),
}));

// Mock NativeEventEmitter
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  return jest.fn().mockImplementation(() => ({
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
  }));
});

// Mock native platform constants - must be before React Native loads
jest.mock('react-native/Libraries/Utilities/NativePlatformConstantsIOS', () => {
  const mockConstants = {
    systemVersion: '17.0',
    interfaceIdiom: 'phone',
    isDisableAnimations: false,
  };
  return {
    __esModule: true,
    default: {
      getConstants: jest.fn(() => mockConstants),
    },
    getConstants: jest.fn(() => mockConstants),
  };
}, { virtual: false });

jest.mock('react-native/Libraries/Utilities/NativePlatformConstantsAndroid', () => ({
  default: {
    getConstants: jest.fn(() => ({
      Version: 33,
    })),
  },
}));

// Mock Dimensions directly
jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
  const dimensions = {
    window: { width: 375, height: 812, scale: 2, fontScale: 1 },
    screen: { width: 375, height: 812, scale: 2, fontScale: 1 },
  };
  
  return {
    __esModule: true,
    default: {
      get: jest.fn((dimension) => dimensions[dimension] || dimensions.window),
      set: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    window: dimensions.window,
    screen: dimensions.screen,
  };
});

// Mock React Native native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    NativeModules: {
      ...RN.NativeModules,
      DevMenu: {
        show: jest.fn(),
      },
    },
    Platform: {
      ...RN.Platform,
      OS: 'ios',
      Version: 17,
      select: jest.fn((obj) => obj.ios || obj.default),
    },
  };
});

// Mock Expo runtime to prevent import errors
global.__ExpoImportMetaRegistry = new Map();

// Mock expo installGlobal to prevent runtime import errors
jest.mock('expo/src/winter/installGlobal', () => ({
  installGlobal: jest.fn(),
  getValue: jest.fn(() => {
    // Return a mock structuredClone if needed
    return global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));
  }),
}), { virtual: true });

// Mock expo winter runtime before it loads
jest.mock('expo/src/winter/runtime.native', () => ({
  __esModule: true,
  default: {},
}), { virtual: true });

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabase: jest.fn(() => ({
    exec: jest.fn(),
    closeAsync: jest.fn(),
    runAsync: jest.fn(),
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
  })),
}));

// Mock expo module to prevent runtime initialization
jest.mock('expo', () => ({
  __esModule: true,
  default: {},
}));

// Mock ErrorUtils
global.ErrorUtils = {
  setGlobalHandler: jest.fn(),
  getGlobalHandler: jest.fn(),
  reportError: jest.fn(),
};

// Mock __DEV__
global.__DEV__ = true;

// Polyfill structuredClone for Expo
if (!global.structuredClone) {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock react-native-reanimated to prevent "Native animated module is not available" error
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View: View,
      Text: View,
      Image: View,
      ScrollView: View,
      createAnimatedComponent: (component: any) => component,
    },
    View: View,
    Text: View,
    Image: View,
    ScrollView: View,
    createAnimatedComponent: (component: any) => component,
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((value) => value),
    withSpring: jest.fn((value) => value),
    withDecay: jest.fn((value) => value),
    runOnJS: jest.fn((fn) => fn),
    runOnUI: jest.fn((fn) => fn),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      poly: jest.fn(),
      sin: jest.fn(),
      circle: jest.fn(),
      exp: jest.fn(),
      elastic: jest.fn(),
      back: jest.fn(),
      bounce: jest.fn(),
      bezier: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    },
  };
});

// Mock NativeAnimatedHelper to prevent native module errors
jest.mock('react-native/src/private/animated/NativeAnimatedHelper', () => ({
  API: {
    flushQueue: jest.fn(),
    queueAndExecuteBatchedOperations: jest.fn(),
  },
  shouldUseNativeDriver: jest.fn(() => false),
}));
