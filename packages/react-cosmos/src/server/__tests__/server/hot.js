import webpackHotMiddleware from 'webpack-hot-middleware';
import startServer from '../../server';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 9999,
    hostname: '127.0.0.1',
    hot: true,
    globalImports: [],
    componentPaths: []
  })
}));

const getCbs = {};
const mockGet = jest.fn((path, cb) => {
  getCbs[path] = cb;
});
const mockUse = jest.fn();
const mockListen = jest.fn();

jest.mock('express', () => {
  const mockExpress = jest.fn(() => ({
    get: mockGet,
    use: mockUse,
    listen: mockListen
  }));
  mockExpress.static = jest.fn();
  return mockExpress;
});

jest.mock('webpack', () => jest.fn(() => 'MOCK_WEBPACK_COMPILER'));

jest.mock('webpack-dev-middleware', () => jest.fn(() => 'MOCK_DEV_MIDDLEWARE'));
jest.mock('webpack-hot-middleware', () => jest.fn(() => 'MOCK_HOT_MIDDLEWARE'));

jest.mock('../../extend-webpack-config', () =>
  jest.fn(() => 'MOCK_WEBPACK_CONFIG')
);

beforeEach(() => {
  jest.clearAllMocks();
  startServer();
});

it('sends webpack compiler to hot middleware', () => {
  expect(webpackHotMiddleware.mock.calls[0][0]).toBe('MOCK_WEBPACK_COMPILER');
});

it('does not use hot middleware', () => {
  expect(mockUse).toHaveBeenCalledWith('MOCK_HOT_MIDDLEWARE');
});
