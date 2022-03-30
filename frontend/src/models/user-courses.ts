export interface IUserCourses {
  status: string;
  data: Data;
}

export interface Data {
  courses: Course[];
}

export interface Course {
  cviciaci: string[];
  _id: string;
  name: string;
  course: string;
  semester: string;
  year: number;
  lecturer: string[];
  __v: number;
  id: string;
}
