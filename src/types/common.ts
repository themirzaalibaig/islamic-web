export interface Pagination {
  page?: number
  limit?: number
}

export interface Sort {
  sort?: string
  order?: 'asc' | 'desc'
}

export interface Search {
  search?: string
  fields?: string[]
}

export interface DateRange {
  startDate?: Date
  endDate?: Date
}

export interface Status {
  status?: 'active' | 'inactive'
}

export interface IdentifiableType {
  _id: string;
}

export interface SoftDeleteType {
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface TimestampType {
  createdAt: Date;
  updatedAt: Date;
}

export interface UserTrackingType {
  createdBy: string;
  updatedBy: string;
}

export interface FullAuditType{
  deletedAt: Date | null;
  createdBy: string;
  updatedBy: string;
}

export interface IdentifiableType {
  _id: string;
}

export interface VersionType {
  version: number;
}

export interface MetadataType {
  metadata: Record<string, any>;
}

export interface ActiveType {
  isActive?: boolean;
}
