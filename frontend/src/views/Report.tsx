import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserContext } from "../context/user-context";
import DatePicker from "@mui/lab/DatePicker";
import { IUserCourses } from "../models/user-courses";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";

const Report = () => {
  const { user } = useContext(UserContext);

  const [photo, setPhoto] = useState<File | null>();
  const [courses, setCourses] = useState<IUserCourses>();
  const [long, setLong] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [reciever, setReciever] = useState<string>("");

  const [course, setCourse] = useState<string>("");
  const [courseType, setCourseType] = useState("prednaska");

  const handleChangePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoto(event.target.files?.item(0));
  };

  const handleChangeCourse = (event: SelectChangeEvent<string>) => {
    setCourse(event.target.value);
  };

  const handleChangeCourseType = (event: SelectChangeEvent<string>) => {
    setCourseType(event.target.value);
  };

  const handleChangeReciever = (event: SelectChangeEvent<string>) => {
    setReciever(event.target.value);
  };

  const handleChangeDescriptioon = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const getPosition = async () => {
    navigator.geolocation.watchPosition((position) => {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
  };

  useEffect(() => {
    getPosition();
  }, []);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${window.localStorage.getItem("token")}`
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch("http://localhost:4000/api/timetables/get-courses", requestOptions)
      .then((response) => response.json())
      .then((result: IUserCourses) =>
        setCourses(result.status === "error" ? undefined : result)
      );
  }, []);

  useEffect(() => {
    courses &&
      courses.data.courses.length > 0 &&
      setCourse(courses.data.courses[0].name);
  }, [courses]);

  const upload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (photo) {
      const storageRef = ref(storage, `images/${photo.name}`);

      uploadBytes(storageRef, photo).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          var raw = {
            course: course,
            courseType: courseType,
            lat: lat,
            long: long,
            quickDesc: description,
            description: description,
            dayOfAbsence: date,
            reciever: reciever,
            photo: url,
          };

          var myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${user?.token}`);
          myHeaders.append("Content-Type", "application/json");

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(raw),
          };

          fetch("http://localhost:4000/api/reports", requestOptions)
            .then((response) => response.json())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
        });
      });
    } else {
      var raw = {
        course: course,
        courseType: courseType,
        lat: lat,
        long: long,
        quickDesc: description,
        description: description,
        dayOfAbsence: date,
        reciever: reciever,
      };

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${user?.token}`);
      myHeaders.append("Content-Type", "application/json");

      console.log(raw);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
      };

      fetch("http://localhost:4000/api/reports", requestOptions)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    }
  };

  const lectOrCvicenie =
    courseType === "cvicenie"
      ? courses?.data.courses
          .find((actCourse) => actCourse.name === course)
          ?.cviciaci.map((actCviciaci) => (
            <MenuItem value={actCviciaci}>{actCviciaci}</MenuItem>
          ))
      : courses?.data.courses
          .find((actCourse) => actCourse.name === course)
          ?.lecturer.map((actLecturer) => (
            <MenuItem value={actLecturer}>{actLecturer}</MenuItem>
          ));

  return (
    <div>
      <form onSubmit={upload}>
        <FormControl fullWidth>
          <InputLabel>Kurz</InputLabel>
          <Select value={course} label="Kurz" onChange={handleChangeCourse}>
            {courses?.data.courses.map((course) => (
              <MenuItem key={course.id} value={course.name}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Typ kurzu</InputLabel>
          <Select
            value={courseType}
            label="Typ kurzu"
            onChange={handleChangeCourseType}
          >
            <MenuItem value="prednaska">Prednáška</MenuItem>
            <MenuItem value="cvicenie">Cvičenie</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Vyučujúci</InputLabel>
          <Select label="Vyučujúci" onChange={handleChangeReciever}>
            {lectOrCvicenie}
          </Select>
        </FormControl>
        <TextareaAutosize
          value={description}
          onChange={handleChangeDescriptioon}
          placeholder="Empty"
          minRows={3}
          style={{ width: "100%" }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Dátum absencie"
            value={date}
            onChange={(newValue) => {
              setDate(newValue as string);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <input type="file" onChange={handleChangePhoto} />
        <Button variant="contained" type="submit">
          Pridať
        </Button>
      </form>
    </div>
  );
};

export default Report;
