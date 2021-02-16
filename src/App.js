import "./App.css";
import { useState, useEffect } from "react";
import styled from "styled-components";
import ValueBox from "./components/ValueBox";
import DataTable from "./components/DataTable";
import ErrorSnackBar from "./components/ErrorSnackbar";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AppBar from "@material-ui/core/AppBar";

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
  margin-left 15px;
  margin-right: 15px;
`;

const DatesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const ResultBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 23vw;
  margin: 25px 15px;
`;

const fetchFunction = (start, end, token) => {
  return fetch(
    `https://api.giosg.com/api/reporting/v1/rooms/84e0fefa-5675-11e7-a349-00163efdd8db/chat-stats/daily/?start_date=${start}&end_date=${end}`,
    {
      headers: {
        authorization: token,
      },
    }
  ).then((response) => {
    if (response.status !== 200) {
      throw new Error(response.status);
    }
    return response.json();
  });
};

const getDateRange = (startDate, endDate) => {
  return (
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
    (1000 * 3600 * 24)
  );
};

const DATE_ERROR = {
  START_AFTER_END: "Start date after end date",
  END_BEFORE_START: "End date before start date",
  RANGE_TOO_LONG: "Max date range is 730 days.",
};

const DEFAULT_RESPONSE = {
  total_conversation_count: 0,
  total_user_message_count: 0,
  total_visitor_message_count: 0,
  by_date: [],
};

function App() {
  const d = new Date().toISOString().slice(0, 10);

  const [response, setResponse] = useState(DEFAULT_RESPONSE);
  const [token, setToken] = useState("");
  const [startDate, setStartDate] = useState(d);
  const [endDate, setEndDate] = useState(d);

  const [startDateError, setStartDateError] = useState(null);
  const [endDateError, setEndDateError] = useState(null);
  const [invalidToken, setInvalidToken] = useState(false);

  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const clearErrors = () => {
    setInvalidToken(false);
  };

  const onSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const getStartDateError = () => {
    if (startDate > endDate) {
      return DATE_ERROR.START_AFTER_END;
    } else if (getDateRange(startDate, endDate) > 730) {
      return DATE_ERROR.RANGE_TOO_LONG;
    } else {
      return null;
    }
  };

  const getEndDateError = () => {
    if (endDate < startDate) {
      return DATE_ERROR.END_BEFORE_START;
    } else if (getDateRange(startDate, endDate) > 730) {
      return DATE_ERROR.RANGE_TOO_LONG;
    } else {
      return null;
    }
  };

  useEffect(() => {
    setStartDateError(getStartDateError);
    setEndDateError(getEndDateError);
  }, [startDate, endDate]);

  useEffect(() => {
    if (token && getStartDateError() == null && getEndDateError() == null) {
      fetchFunction(startDate, endDate, token)
        .then((data) => setResponse(data))
        .then(() => clearErrors())
        .catch((err) => {
          setResponse(DEFAULT_RESPONSE);
          clearErrors();
          if (err.message === "401") {
            setInvalidToken(true);
          } else {
            setSnackBarOpen(true);
          }
        });
    } else {
      setResponse(DEFAULT_RESPONSE);
    }
  }, [startDate, endDate, token, startDateError, endDateError]);

  const handleStartDate = (event) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate);
  };

  const handleEndDate = (event) => {
    const newEndDate = event.target.value;
    setEndDate(newEndDate);
  };

  const handleAccesstoken = (event) => {
    setToken(event.target.value);
  };

  const showTokenError = Boolean(token.length !== 0 && invalidToken);

  return (
    <div className="App">
      <AppBar style={{ marginBottom: "2rem" }} position="sticky">
        <p>My coding assignment</p>
      </AppBar>

      <InputContainer>
        <DatesContainer>
          <TextField
            error={startDateError !== null}
            helperText={startDateError || ""}
            id="outlined-basic"
            label="Start date"
            variant="outlined"
            type="date"
            value={startDate}
            onChange={handleStartDate}
          />
          <TextField
            error={endDateError !== null}
            helperText={endDateError || ""}
            id="outlined-basic"
            label="End date"
            variant="outlined"
            type="date"
            value={endDate}
            onChange={handleEndDate}
          />
        </DatesContainer>
        <TextField
          error={showTokenError}
          helperText={showTokenError ? "Invalid token" : ""}
          id="input-with-icon-textfield"
          variant="outlined"
          placeholder={"Access token"}
          value={token}
          onChange={handleAccesstoken}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />
      </InputContainer>

      <>
        <ResultBoxContainer>
          <ValueBox
            value={response.total_conversation_count}
            title={"Total conversation count"}
          />
          <ValueBox
            value={response.total_user_message_count}
            title={"Total user message count"}
          />
          <ValueBox
            value={response.total_visitor_message_count}
            title={"Total visitor message count"}
          />
        </ResultBoxContainer>

        <DataTable
          rows={response.by_date.map((elem) => ({
            ...elem,
            id: elem.date,
          }))}
        />
      </>

      <ErrorSnackBar open={snackBarOpen} onClose={onSnackBarClose} />
    </div>
  );
}

export default App;
