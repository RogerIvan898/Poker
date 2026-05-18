import { api } from '../base';

interface TableConnectResponse {
  connected: boolean;
}

const connectToTable = (tableId: string) =>
  api.post<TableConnectResponse>('/tables/connect', { id: tableId });

export const gameApi = { connectToTable };
