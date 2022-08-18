import {
  Chip,
  Card,
  IconButton,
  CardContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CardActions,
  Toolbar,
  Typography,
  TextField,
  Input,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
} from "@mui/material";
import { Box } from "@mui/system";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Fragment, useState } from "react";
import { useContextSelector } from "use-context-selector";
import {
  AccessTime,
  MoreVert,
  Add,
  DriveFileRenameOutline,
  Delete,
  Clear,
  ClearRounded,
  AddAlert,
  AddAlertOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import uniqid from "uniqid";
import { projectContext } from "./App";
import { useRef } from "react";
import { useEffect } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { format, parseISO } from "date-fns";

function AddReminderForm(props) {
  const [value, setValue] = useState(new Date());
  const current = useContextSelector(
    projectContext,
    (project) => project.current
  );
  const addCard = useContextSelector(
    projectContext,
    (project) => project.addCard
  );
  const setReminder = useContextSelector(
    projectContext,
    (project) => project.setReminder
  );
  const deleteReminder = useContextSelector(
    projectContext,
    (project) => project.deleteReminder
  );

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const setOrEdit = () => {
    if (props.reminderExists) return "Edit reminder";
    else return "Set reminder";
  };

  const showDelete = () => {
    if (props.reminderExists)
      return (
        <Button
          onClick={() => {
            deleteReminder(current, props.id);
            props.checkReminder();
            props.handleClose();
          }}
        >
          Delete
        </Button>
      );
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>{setOrEdit()}</DialogTitle>
      <DialogContent sx={{ paddingTop: "5px !important" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="Date"
            value={value}
            inputFormat="dd/MM H:mm"
            onChange={(newValue) => {
              setValue(newValue);
            }}
            ampm={false}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        {showDelete()}
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (value) {
              setReminder(current, props.id, value.toISOString());
              props.handleClose();
            }
          }}
        >
          Set
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function CardOptionsMenu(props) {
  const [open, setOpen] = useState(false);
  const [reminderExists, setReminderExistence] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteCard = useContextSelector(
    projectContext,
    (project) => project.deleteCard
  );

  const current = useContextSelector(
    projectContext,
    (project) => project.current
  );

  const checkIfReminderExists = (() => {
    if (props.reminder && reminderExists != true) setReminderExistence(true);
    else if (props.reminder === undefined && reminderExists !== false)
      setReminderExistence(false);
  })();

  const defineIfItsSetOrEditReminder = () => {
    if (reminderExists) {
      return "Edit Reminder";
    } else return "Set Reminder";
  };

  return (
    <Fragment>
      <Menu
        id="project-options-menu"
        MenuListProps={{
          "aria-labelledby": "project-options-menu-button",
        }}
        anchorEl={props.anchorEl}
        open={props.open}
        onClose={props.handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClickOpen();
            props.handleClose();
          }}
        >
          <AddAlertOutlined /> {defineIfItsSetOrEditReminder()}
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteCard(current, props.id);
            props.handleClose();
          }}
        >
          <DeleteOutline /> Delete
        </MenuItem>
      </Menu>
      <AddReminderForm
        open={open}
        handleClose={handleClose}
        id={props.id}
        reminderExists={reminderExists}
        checkReminder={props.checkReminder}
      />
    </Fragment>
  );
}

function CardInfo(props) {
  const [anchorEl, setAnchorEl] = useState(false);
  const [reminderIsVisible, setReminderVisibility] = useState("hidden");
  const [reminder, setReminder] = useState();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkReminder = () => {
    if (props.reminder && props.reminder !== reminder) {
      setReminderVisibility("visible");
      setReminder(props.reminder);
    } else if (
      props.reminder === undefined &&
      reminderIsVisible === "visible"
    ) {
      setReminderVisibility("hidden");
    }
  };

  const checkDate = (date) => {
    let dateIsValid = !Number.isNaN(new Date(date).getTime());
    if (dateIsValid) {
      return format(parseISO(date), "d MMM, HH:mm");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minWidth: "100%",
      }}
    >
      {checkReminder()}
      <Chip
        icon={<AccessTime />}
        label={checkDate(reminder)}
        size="small"
        variant="outlined"
        sx={{ marginBottom: 1, marginLeft: 1, visibility: reminderIsVisible }}
      />
      <IconButton
        onClick={handleClick}
        sx={{ p: 0, marginBottom: 1, marginRight: 1 }}
      >
        <MoreVert />
      </IconButton>
      <CardOptionsMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
        id={props.id}
        reminder={props.reminder}
        checkReminder={checkReminder}
      />
    </Box>
  );
}

function CardContentContainer(props) {
  const [anchorEl, setAnchorEl] = useState(false);
  const [currentTimeout, setCurrentTimeout] = useState(undefined);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (Array.isArray(props.content)) {
      itemsRef.current = itemsRef.current.slice(0, props.content.length);
    }
  }, [props.content]);

  const useForceUpdate = () => {
    const [value, setValue] = useState(0);
    return () => setValue((value) => value + 1);
  };
  const forceUpdate = useForceUpdate();

  const updateCard = useContextSelector(
    projectContext,
    (project) => project.updateCard
  );
  const current = useContextSelector(
    projectContext,
    (project) => project.current
  );

  const open = Boolean(anchorEl);

  const mouseDown = (e) => {
    // e.stopPropagation();
    handleClick(e);
    console.log(e.currentTarget);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeNote = (e) => {
    updateCard(current, props.id, e.target.value, "note");
  };

  const handleChangeCheckbox = (e) => {
    let content;
    if (e.target.type === "checkbox") {
      content = { checked: e.target.checked };
    } else {
      content = { label: e.target.value };
    }

    updateCard(current, props.id, content, "checklist", Number(e.target.id));
  };

  const handleTimeoutCallback = (e, type) => {
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    if (type === "checkbox") {
      setCurrentTimeout(setTimeout(handleChangeCheckbox.bind(null, e), 1000));
    } else {
      setCurrentTimeout(setTimeout(handleChangeNote.bind(null, e), 1000));
    }
  };

  const addCheckBox = () => {
    let content = { label: undefined, checked: false, key: uniqid() };
    updateCard(current, props.id, content, "checklist");
  };

  const deleteCheckBox = (id) => {
    let content = null;
    updateCard(current, props.id, content, "checklist", id);
  };

  const changeDeleteButtonVisibility = (index) => {
    if (itemsRef.current[index] && itemsRef.current[index].visibility) {
      return itemsRef.current[index].visibility;
    } else return "hidden";
  };

  const generateContent = () => {
    // itemsRef.current.map((ref, index) => {
    //   ref.visibility = "hidden";
    // });

    // itemsRef.current.forEach((el) => (el.visibility = "hidden"));

    if (props.type === "note") {
      return (
        <Typography>
          <Input
            multiline
            maxRows={9}
            disableUnderline
            defaultValue={props.content}
            placeholder="Insert a note"
            onChange={handleTimeoutCallback}
          />
        </Typography>
      );
    } else {
      let listItems = props.content.map((cntnt, index) => {
        return (
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            onMouseOver={(e) => {
              if (e.target.id) {
                itemsRef.current[e.target.id].visibility = "visible";
                forceUpdate();
              }
            }}
            key={cntnt.key}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(cntnt.checked)}
                  onChange={handleChangeCheckbox}
                  id={index.toString()}
                />
              }
              label={
                <Input
                  multiline
                  maxRows={9}
                  disableUnderline
                  defaultValue={cntnt.label}
                  onChange={(e) => handleTimeoutCallback(e, "checkbox")}
                  id={index.toString()}
                />
              }
            />
            <Box
              onMouseEnter={(e) => {
                if (e.target.firstChild.id) {
                  itemsRef.current[e.target.firstChild.id].visibility =
                    "visible";
                  forceUpdate();
                }
              }}
            >
              <IconButton
                id={index}
                onClick={() => deleteCheckBox(index)}
                ref={(e) => {
                  itemsRef.current[index] = e;
                  if (e) {
                    itemsRef.current[index].visibility = "hidden";
                  }
                }}
                sx={{ visibility: `${changeDeleteButtonVisibility(index)}` }}
              >
                <Clear />
              </IconButton>
            </Box>
          </Box>
        );
      });

      return (
        <FormGroup>
          <Box onMouseLeave={forceUpdate}>{listItems}</Box>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <IconButton onClick={addCheckBox}>
              <Add />
            </IconButton>
          </CardActions>
        </FormGroup>
      );
    }
  };

  return (
    <Fragment>
      <CardContent sx={{ minWidth: "87.5%", overflowY: "auto" }}>
        {generateContent()}
      </CardContent>
      <CardInfo id={props.id} reminder={props.reminder} />
    </Fragment>
  );
}

function GenericCard(props) {
  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: 230,
        maxWidth: 280,
        height: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <CardContentContainer
        id={props.id}
        content={props.card.content}
        reminder={props.card.reminder}
        type={props.card.type}
      />
    </Card>
  );
}

function CardContainer(props) {
  const projectList = useContextSelector(
    projectContext,
    (project) => project.list
  );
  const current = useContextSelector(
    projectContext,
    (project) => project.current
  );
  const renderCards = () => {
    let cards;
    if (projectList.length > 0) {
      cards = projectList[current].cards;
    }
    if (cards) {
      cards = cards.map((card, index) => {
        if (card) {
          return <GenericCard key={card.key} id={index} card={card} />;
        } else {
          return null;
        }
      });
      return cards;
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: 5,
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 250px))",
      }}
    >
      {renderCards()}
    </Box>
  );
}

function ProjectContainer(props) {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <CardContainer />
    </Box>
  );
}

export default ProjectContainer;
