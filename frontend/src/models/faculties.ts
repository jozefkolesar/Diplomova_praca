// Generated by https://quicktype.io

export interface IFaculties {
  status: string;
  results: number;
  data: Data;
}

export interface Data {
  data: Datum[];
}

export interface Datum {
  department: string[];
  _id: string;
  name: string;
  id: string;
}
