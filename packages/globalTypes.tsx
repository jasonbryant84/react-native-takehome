export interface ErrorType {
    fieldMissing?: string;
    message?: string;
    success?: boolean;
}

export interface UserType {
    id: number | null;
    username: string | null;
    token: string | null;
    created_timestamp: string | null;
    last_modified_timestamp: string | null;
  }
  