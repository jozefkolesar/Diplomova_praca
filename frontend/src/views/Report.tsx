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

const Report = () => {
  const { user } = useContext(UserContext);

  const [photo, setPhoto] = useState<File | null>();
  const [long, setLong] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [reciever, setReciever] = useState("Ivana Kováčová");

  const [course, setCourse] = useState("MIS");
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

  const upload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${user?.token}`);

    var formdata = new FormData();
    formdata.append("course", course);
    formdata.append("courseType", courseType);
    formdata.append("description", description);
    formdata.append("quickDesc", description);
    formdata.append("dayOfAbsence", date as string);
    formdata.append("reciever", "Ivana Kováčová");
    formdata.append("lat", lat.toString());
    formdata.append("long", long.toString());
    formdata.append("photo", photo!, photo?.name);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };

    fetch("http://localhost:4000/api/reports", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <form onSubmit={upload}>
        <FormControl fullWidth>
          <InputLabel>Kurz</InputLabel>
          <Select value={course} label="Kurz" onChange={handleChangeCourse}>
            <MenuItem value="MIS">MIS</MenuItem>
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
          <Select
            value={reciever}
            label="Vyučujúci"
            onChange={handleChangeReciever}
          >
            <MenuItem value="Ivana Kováčová">Ivana Kováčová</MenuItem>
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
