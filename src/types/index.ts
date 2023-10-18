interface BaseData {
  id: string;
  shift: '6:30' | '7:30' | '8:30' | '9:00' | '9:30';
  departmentId: 'DEPT1' | 'DEPT2' | 'DEPT3' | 'DEPT4';
  zone: 'HQ' | 'AZ';
  dateTime: string;
}

export interface EntryData extends BaseData {
  hasContraband: boolean;
}

export interface Contraband {
  electronicDevice: number,
  laptop: number,
  scissor: number,
  knife: number,
  gun: number,
}

export interface SecurityData extends BaseData {
  contraband: Contraband;
  fileName: string;
}

export interface DataRow {
  DateTime: string | null;
  DeptId: string | null;
  EmpId: string | null;
  EmpShift: string;
  id: number;
  Img: string | null;
  ToolScanTime: number | null;
  Zone: string | null;
  Status: string;
}
