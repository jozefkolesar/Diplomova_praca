import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
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

  const Input = styled("input")({
    display: "none",
  });

  const getPosition = async () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      (error) => {
        navigate("/");
        enqueueSnackbar(
          "Pre pr??stup mus??te povoli?? lokaliz??ciu zariadenia v prehliada??i a GPS",
          {
            variant: "error",
          }
        );
      }
    );
  };

  useEffect(() => {
    getPosition();
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

    fetch(
      "https://nahlasovanie-neucasti-app.herokuapp.com/api/timetables/get-courses",
      requestOptions
    )
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
      enqueueSnackbar("Nezadali ste d??tum", { variant: "error" });
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

          fetch(
            "https://nahlasovanie-neucasti-app.herokuapp.com/api/reports",
            requestOptions
          )
            .then((response) => response.json())
            .then((result) => {
              if (result.status === "success") {
                enqueueSnackbar("??spe??ne ste pridali ??iados??", {
                  variant: "success",
                });
                navigate("/");
              } else {
                enqueueSnackbar("??iados?? sa nepodarilo prida??", {
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

      fetch(
        "https://nahlasovanie-neucasti-app.herokuapp.com/api/reports",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success") {
            enqueueSnackbar("??spe??ne ste pridali ??iados??", {
              variant: "success",
            });
            navigate("/");
          } else {
            enqueueSnackbar("??iados?? sa nepodarilo prida??", {
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
      <h1>Nahl??senie ne????asti</h1>
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
            <MenuItem value="prednaska">Predn????ka</MenuItem>
            <MenuItem value="cvicenie">Cvi??enie</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Vyu??uj??ci</InputLabel>
          <Select label="Vyu??uj??ci" onChange={handleChangeReciever} required>
            {lectOrCvicenie}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>D??vod ne????asti</InputLabel>
          <Select
            label="D??vod ne????asti"
            onChange={handleChangeDefaultDescription}
          >
            <MenuItem value="Me??kanie MHD/vlaku">Me??kanie MHD/vlaku</MenuItem>
            <MenuItem value="Kol??na/nehoda/pr??ce na ceste">
              Kol??na/nehoda/pr??ce na ceste
            </MenuItem>
            <MenuItem value="Choroba">Choroba</MenuItem>
            <MenuItem value="N??v??teva lek??ra">N??v??teva lek??ra</MenuItem>
            <MenuItem value="Zaspatie">Zaspatie</MenuItem>
            <MenuItem value="In??">In??</MenuItem>
          </Select>
        </FormControl>
        <p>a taktie??</p>
        <TextareaAutosize
          value={description}
          onChange={handleChangeDescriptioon}
          placeholder="Tu m????e?? bli????ie op??sa?? d??vod svojej ne????asti/me??kania"
          minRows={3}
          style={{ width: "100%" }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="D??tum absencie"
            value={date}
            onChange={(newValue) => {
              setDate(newValue as string);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <p>kliknut??m na tla??idlo dole prid???? fotku</p>
        <div className="center">
          <label htmlFor="contained-button-file">
            <Input
              id="contained-button-file"
              type="file"
              onChange={handleChangePhoto}
            />
            <Button variant="contained" component="span">
              Fotka
            </Button>
          </label>
          {photo && <p>{photo.name}</p>}
        </div>
        <Button variant="contained" type="submit">
          Odosla??
        </Button>
      </form>
    </div>
  );
};

export default Report;
