import { createEvent, createStore } from 'effector';

const STORAGE_KEY = 'poker:mock-server';

export const readMockServerEnabled = (): boolean =>
  globalThis.localStorage?.getItem(STORAGE_KEY) === '1';

export const mockServerChanged = createEvent<boolean>();

export const $mockServerEnabled = createStore(readMockServerEnabled()).on(
  mockServerChanged,
  (_, enabled) => enabled
);

mockServerChanged.watch(enabled => {
  globalThis.localStorage?.setItem(STORAGE_KEY, enabled ? '1' : '0');
});

export const setMockServerEnabled = async (enabled: boolean) => {
  const { applyMockServer } = await import('../../mocks/runtime');

  await applyMockServer(enabled);
  mockServerChanged(enabled);
};

export const bootstrapMockServer = async () => {
  if (!readMockServerEnabled()) {
    return;
  }

  await setMockServerEnabled(true);
};
