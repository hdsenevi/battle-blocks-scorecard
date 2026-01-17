module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(.pnpm/)?((jest-)?react-native|@react-native|@react-native/.*|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))',
  ],
  moduleNameMapper: {
    '^@react-native/js-polyfills/error-guard$': '<rootDir>/__mocks__/@react-native/js-polyfills/error-guard.js',
    '^react-native/src/private/specs_DEPRECATED/modules/NativeDeviceInfo$': '<rootDir>/__mocks__/NativeDeviceInfo.js',
    '^react-native/Libraries/Utilities/NativeDeviceInfo$': '<rootDir>/__mocks__/NativeDeviceInfo.js',
    '^expo/src/winter/runtime.native$': '<rootDir>/__mocks__/expo-runtime.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: [
    'services/**/*.{ts,tsx}',
    '!services/**/*.d.ts',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
