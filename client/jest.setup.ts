import { server } from './src/features/mocks/server';

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
