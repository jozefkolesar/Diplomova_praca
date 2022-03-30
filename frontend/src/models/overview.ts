// Generated by https://quicktype.io

export interface IOverviewReports {
  status: string;
  data: Data;
}

export interface Data {
  reports: Report[];
}

export interface Report {
  _id: string;
  pushed_reports: PushedReport[];
  numberOfReports: number;
  sortField: number;
}

export interface PushedReport {
  _id: string;
  status: string;
  createdAt: string;
  course: string;
  courseType: string;
  description: string;
  dayOfAbsence: string;
  reciever: string;
  lat: number;
  long: number;
  user: User[];
  photo: string;
  __v: number;
  onlyDate: string;
}

export interface User {
  name: string;
  department: string;
  email: string;
  __v: number;
}
