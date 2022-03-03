export interface IUserReports {
  status: string;
  results: number;
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
