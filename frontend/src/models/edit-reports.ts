export interface IEditReports {
  status: string;
  data: Data;
}

export interface Data {
  reports: Report[];
}

export interface Report {
  status: string;
  createdAt: string;
  _id: string;
  course: string;
  courseType: string;
  description: string;
  dayOfAbsence: string;
  reciever: string;
  lat: number;
  long: number;
  user: User;
  photo: string;
  __v: number;
  id: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface ISingleReport {
  status: string;
  data: TopLevelData;
}

export interface TopLevelData {
  data: DataData;
}

export interface DataData {
  status: string;
  createdAt: string;
  _id: string;
  course: string;
  courseType: string;
  description: string;
  selectDesc: string;
  dayOfAbsence: string;
  reciever: string;
  lat: number;
  long: number;
  user: User;
  photo?: string;
  __v: number;
  id: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}
