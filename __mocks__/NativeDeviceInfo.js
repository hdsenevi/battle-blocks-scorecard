// Mock for NativeDeviceInfo
module.exports = {
  default: {
    getConstants: jest.fn(() => ({
      Dimensions: {
        window: { width: 375, height: 812 },
        screen: { width: 375, height: 812 },
      },
    })),
  },
};
