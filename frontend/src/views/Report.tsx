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
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import "./Report.scss";

const Report = () => {
  const { user } = useContext(UserContext);

  const [photo, setPhoto] = useState<File | null>();
  const [courses, setCourses] = useState<IUserCourses>();
  const [long, setLong] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [defaultDescription, setDefaultDescription] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [reciever, setReciever] = useState<string>("");

  const [course, setCourse] = useState<string>("");
  const [courseType, setCourseType] = useState("prednaska");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

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

  const handleChangeDefaultDescription = (event: SelectChangeEvent<string>) => {
    setDefaultDescription(event.target.value);
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

  const navigateToMenu = () => {
    navigate("/");
    enqueueSnackbar("Pre prístup musíte povoliť lokalizáciu zariadenia", {
      variant: "error",
    });
  };

  useEffect(() => {
    getPosition();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (result) {
        result.state === "denied" && navigateToMenu();
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${window.localStorage.getItem("token")}`
    );
    myHeaders.append("Cookie", `jwt=${window.localStorage.getItem("token")}`);

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

    if (date === null) {
      enqueueSnackbar("Nezadali ste dátum", { variant: "error" });
      return;
    }

    if (photo) {
      const storageRef = ref(storage, `images/${photo.name}`);

      uploadBytes(storageRef, photo).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          var raw = {
            course: course,
            courseType: courseType,
            lat: lat,
            long: long,
            selectDesc: defaultDescription,
            description: description,
            dayOfAbsence: date,
            reciever: reciever,
            photo: url,
          };

          var myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${user?.token}`);
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append(
            "Cookie",
            `jwt=${window.localStorage.getItem("token")}`
          );

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(raw),
          };

          fetch("http://localhost:4000/api/reports", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.status === "success") {
                enqueueSnackbar("Úspešne ste pridali žiadosť", {
                  variant: "success",
                });
                navigate("/");
              } else {
                enqueueSnackbar("Žiadosť sa nepodarilo pridať", {
                  variant: "error",
                });
              }
            });
        });
      });
    } else {
      var raw = {
        course: course,
        courseType: courseType,
        lat: lat,
        long: long,
        selectDesc: defaultDescription,
        description: description,
        dayOfAbsence: date,
        reciever: reciever,
      };

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${user?.token}`);
      myHeaders.append("Cookie", `jwt=${window.localStorage.getItem("token")}`);

      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
      };

      fetch("http://localhost:4000/api/reports", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success") {
            enqueueSnackbar("Úspešne ste pridali žiadosť", {
              variant: "success",
            });
            navigate("/");
          } else {
            enqueueSnackbar("Žiadosť sa nepodarilo pridať", {
              variant: "error",
            });
          }
        });
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
    <div className="report-container">
      <h1>Nahlásenie neúčasti</h1>
      <form onSubmit={upload}>
        <FormControl fullWidth>
          <InputLabel>Kurz</InputLabel>
          <Select
            value={course}
            label="Kurz"
            onChange={handleChangeCourse}
            required
          >
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
            required
          >
            <MenuItem value="prednaska">Prednáška</MenuItem>
            <MenuItem value="cvicenie">Cvičenie</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Vyučujúci</InputLabel>
          <Select label="Vyučujúci" onChange={handleChangeReciever} required>
            {lectOrCvicenie}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Dôvod neúčasti</InputLabel>
          <Select
            label="Dôvod neúčasti"
            onChange={handleChangeDefaultDescription}
          >
            <MenuItem value="Meškanie MHD/vlaku">Meškanie MHD/vlaku</MenuItem>
            <MenuItem value="Kolóna/nehoda/práce na ceste">
              Kolóna/nehoda/práce na ceste
            </MenuItem>
            <MenuItem value="Choroba">Choroba</MenuItem>
            <MenuItem value="Návšteva lekára">Návšteva lekára</MenuItem>
            <MenuItem value="Zaspatie">Zaspatie</MenuItem>
            <MenuItem value="Iný">Iný</MenuItem>
          </Select>
        </FormControl>
        <TextareaAutosize
          value={description}
          onChange={handleChangeDescriptioon}
          placeholder="Tu môžeš bližšie opísať dôvod svojej neúčasti/meškania"
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
          Odoslať
        </Button>
      </form>
    </div>
  );
};

export default Report;
