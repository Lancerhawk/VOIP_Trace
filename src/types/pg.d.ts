declare module 'pg' {
  export interface PoolConfig {
    connectionString?: string;
    ssl?: boolean | { rejectUnauthorized: boolean };
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
  }

  export interface PoolClient {
    query(text: string, values?: any[]): Promise<QueryResult>;
    release(): void;
  }

  export interface QueryResult {
    rows: any[];
    rowCount: number;
    command: string;
    oid: number;
    fields: FieldDef[];
  }

  export interface FieldDef {
    name: string;
    tableID: number;
    columnID: number;
    dataTypeID: number;
    dataTypeSize: number;
    dataTypeModifier: number;
    format: string;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    connect(): Promise<PoolClient>;
    query(text: string, values?: any[]): Promise<QueryResult>;
    end(): Promise<void>;
  }
}
