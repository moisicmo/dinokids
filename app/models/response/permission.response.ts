import type { MetaPagination, TypeAction, TypeSubject } from "..";


export interface PermissionResponse extends MetaPagination {
  data: PermissionModel[];
}

export interface PermissionModel {
  id: string;
  action: TypeAction;
  subject: TypeSubject;
}
