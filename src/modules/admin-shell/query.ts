type SearchParamValue = string | string[] | undefined;

export type AdminBaseListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type AdminUsersListParams = AdminBaseListParams;

export type AdminCatalogListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  socialNetwork?: string;
  category?: string;
  type?: string;
};

export type AdminCatalogCreationDraft = {
  supplierServiceId: number;
  supplierName: string;
  name: string;
  category: string;
  type: string;
  minQuantity: number;
  maxQuantity: number;
};

export type AdminPaymentsListParams = AdminBaseListParams & {
  status?: string;
  provider?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type AdminOrdersListParams = AdminBaseListParams & {
  status?: string;
  userId?: string;
};

export type AdminTransactionsListParams = AdminBaseListParams & {
  userId?: string;
  type?: string;
  direction?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type AdminAffiliateProfilesListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
};

export type AdminAffiliateCommissionsListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  affiliateProfileId?: string;
};

export type AdminAffiliatePayoutsListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  affiliateProfileId?: string;
};

export type AdminAlertsListParams = AdminBaseListParams & {
  status?: string;
  severity?: string;
  type?: string;
};

export type AdminAuditsListParams = AdminBaseListParams & {
  adminId?: string;
  action?: string;
  entityType?: string;
};

export type SupplierServicesListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  supplierName?: string;
  category?: string;
  type?: string;
  isActiveAtSupplier?: 'true' | 'false';
};

export type SupplierSyncLogsListParams = {
  page?: number;
  pageSize?: number;
  supplierName?: string;
  syncType?: string;
  status?: string;
  targetType?: string;
};

export function parseAdminUsersParams(searchParams: Record<string, SearchParamValue>): AdminUsersListParams {
  return parseBaseListParams(searchParams);
}

export function parseAdminCatalogParams(searchParams: Record<string, SearchParamValue>): AdminCatalogListParams {
  return {
    page: readPositiveInt(searchParams.page),
    pageSize: readPositiveInt(searchParams.pageSize),
    search: readString(searchParams.search),
    status: readString(searchParams.status),
    socialNetwork: readString(searchParams.socialNetwork),
    category: readString(searchParams.category),
    type: readString(searchParams.type),
  };
}

export function parseAdminCatalogCreationDraft(searchParams: Record<string, SearchParamValue>): AdminCatalogCreationDraft | undefined {
  const supplierServiceId = readPositiveInt(searchParams.createSupplierServiceId);
  const supplierName = readString(searchParams.createSupplierName);
  const name = readString(searchParams.createName);
  const category = readString(searchParams.createCategory);
  const type = readString(searchParams.createType);
  const minQuantity = readPositiveInt(searchParams.createMinQuantity);
  const maxQuantity = readPositiveInt(searchParams.createMaxQuantity);

  if (!supplierServiceId || !supplierName || !name || !category || !type || !minQuantity || !maxQuantity) {
    return undefined;
  }

  return {
    supplierServiceId,
    supplierName,
    name,
    category,
    type,
    minQuantity,
    maxQuantity,
  };
}

export function parseAdminCatalogCreateSupplierServiceId(searchParams: Record<string, SearchParamValue>) {
  return readPositiveInt(searchParams.createSupplierServiceId);
}

export function parseAdminPaymentsParams(searchParams: Record<string, SearchParamValue>): AdminPaymentsListParams {
  return {
    ...parseBaseListParams(searchParams),
    status: readString(searchParams.status),
    provider: readString(searchParams.provider),
    userId: readString(searchParams.userId),
    dateFrom: readString(searchParams.dateFrom),
    dateTo: readString(searchParams.dateTo),
  };
}

export function parseAdminOrdersParams(searchParams: Record<string, SearchParamValue>): AdminOrdersListParams {
  return {
    ...parseBaseListParams(searchParams),
    status: readString(searchParams.status),
    userId: readString(searchParams.userId),
  };
}

export function parseAdminTransactionsParams(searchParams: Record<string, SearchParamValue>): AdminTransactionsListParams {
  return {
    ...parseBaseListParams(searchParams),
    userId: readString(searchParams.userId),
    type: readString(searchParams.type),
    direction: readString(searchParams.direction),
    dateFrom: readString(searchParams.dateFrom),
    dateTo: readString(searchParams.dateTo),
  };
}

export function parseAdminAffiliatesParams(searchParams: Record<string, SearchParamValue>): AdminAffiliateProfilesListParams {
  const sortOrder = readString(searchParams.sortOrder);

  return {
    page: readPositiveInt(searchParams.page),
    pageSize: readPositiveInt(searchParams.pageSize),
    search: readString(searchParams.search),
    sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
    status: readString(searchParams.status),
  };
}

export function parseAdminAffiliateCommissionsParams(searchParams: Record<string, SearchParamValue>): AdminAffiliateCommissionsListParams {
  const sortOrder = readString(searchParams.sortOrder);

  return {
    page: readPositiveInt(searchParams.page),
    pageSize: readPositiveInt(searchParams.pageSize),
    search: readString(searchParams.search),
    sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
    status: readString(searchParams.status),
    affiliateProfileId: readString(searchParams.affiliateProfileId),
  };
}

export function parseAdminAffiliatePayoutsParams(searchParams: Record<string, SearchParamValue>): AdminAffiliatePayoutsListParams {
  const sortOrder = readString(searchParams.sortOrder);

  return {
    page: readPositiveInt(searchParams.page),
    pageSize: readPositiveInt(searchParams.pageSize),
    search: readString(searchParams.search),
    sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
    status: readString(searchParams.status),
    affiliateProfileId: readString(searchParams.affiliateProfileId),
  };
}

export function parseAdminAlertsParams(searchParams: Record<string, SearchParamValue>): AdminAlertsListParams {
  return {
    ...parseBaseListParams(searchParams),
    status: readString(searchParams.status),
    severity: readString(searchParams.severity),
    type: readString(searchParams.type),
  };
}

export function parseAdminAuditsParams(searchParams: Record<string, SearchParamValue>): AdminAuditsListParams {
  return {
    ...parseBaseListParams(searchParams),
    adminId: readString(searchParams.adminId),
    action: readString(searchParams.action),
    entityType: readString(searchParams.entityType),
  };
}

export function parseSupplierServicesParams(searchParams: Record<string, SearchParamValue>): SupplierServicesListParams {
  const isActiveAtSupplier = readString(searchParams.isActiveAtSupplier);

  return {
    page: readPositiveInt(searchParams.servicesPage ?? searchParams.page),
    pageSize: readPositiveInt(searchParams.servicesPageSize ?? searchParams.pageSize),
    search: readString(searchParams.servicesSearch ?? searchParams.search),
    supplierName: readString(searchParams.supplierName ?? searchParams.servicesSupplierName),
    category: readString(searchParams.servicesCategory ?? searchParams.category),
    type: readString(searchParams.servicesType ?? searchParams.type),
    isActiveAtSupplier: isActiveAtSupplier === 'true' || isActiveAtSupplier === 'false' ? isActiveAtSupplier : undefined,
  };
}

export function parseSupplierSyncLogsParams(searchParams: Record<string, SearchParamValue>): SupplierSyncLogsListParams {
  return {
    page: readPositiveInt(searchParams.logsPage),
    pageSize: readPositiveInt(searchParams.logsPageSize),
    supplierName: readString(searchParams.logSupplierName),
    syncType: readString(searchParams.syncType),
    status: readString(searchParams.logStatus),
    targetType: readString(searchParams.targetType),
  };
}

export function buildAdminPath(pathname: string, params: Record<string, string | number | null | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function parseBaseListParams(searchParams: Record<string, SearchParamValue>): AdminBaseListParams {
  const sortOrder = readString(searchParams.sortOrder);

  return {
    page: readPositiveInt(searchParams.page),
    pageSize: readPositiveInt(searchParams.pageSize),
    search: readString(searchParams.search),
    sortBy: readString(searchParams.sortBy),
    sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
  };
}

function readString(value: SearchParamValue) {
  const single = Array.isArray(value) ? value[0] : value;

  if (typeof single !== 'string') {
    return undefined;
  }

  const trimmed = single.trim();
  return trimmed ? trimmed : undefined;
}

function readPositiveInt(value: SearchParamValue) {
  const stringValue = readString(value);

  if (!stringValue) {
    return undefined;
  }

  const parsed = Number.parseInt(stringValue, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}
