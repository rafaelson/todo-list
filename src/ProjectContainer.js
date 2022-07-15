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
} from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useState } from "react";
import { useContextSelector } from "use-context-selector";
import {
  AccessTime,
  MoreVert,
  Add,
  DriveFileRenameOutline,
  Delete,
} from "@mui/icons-material";
import uniqid from "uniqid";
import { projectContext } from "./App";

function CardInfo() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minWidth: "100%",
      }}
    >
      <Chip
        icon={<AccessTime />}
        label={"04 jun, 9:30"}
        size="small"
        variant="outlined"
        sx={{ marginBottom: 1, marginLeft: 1 }}
      />
      <IconButton sx={{ p: 0, marginBottom: 1, marginRight: 1 }}>
        <MoreVert />
      </IconButton>
    </Box>
  );
}

function ProjectOptionsMenu(props) {
  const [open, setOpen] = useState(false);
  const [id, setID] = useState(null);
  const deleteProject = useContextSelector(
    projectContext,
    (project) => project.delete
  );

  const handleFormOpen = () => {
    setOpen(true);
  };

  const handleFormClose = () => {
    setOpen(false);
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
            setID(props.anchorEl.id);
            handleFormOpen();
            props.handleClose();
          }}
        >
          <DriveFileRenameOutline /> Change
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteProject(props.anchorEl.id);
            props.handleClose();
          }}
        >
          <Delete /> Delete
        </MenuItem>
      </Menu>
    </Fragment>
  );
}

function CardContentContainer(props) {
  const [anchorEl, setAnchorEl] = useState(false);
  const [currentTimeout, setCurrentTimeout] = useState(undefined);
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
      setCurrentTimeout(setTimeout(handleChangeCheckbox.bind(null, e), 2000));
    } else {
      setCurrentTimeout(setTimeout(handleChangeNote.bind(null, e), 2000));
    }
  };

  const addCheckBox = () => {
    let content = { label: undefined, checked: false, key: uniqid() };
    updateCard(current, props.id, content, "checklist");
  };

  const generateContent = () => {
    if (props.type === "note") {
      return (
        <Typography>
          <Input
            multiline
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
                disableUnderline
                defaultValue={cntnt.label}
                onChange={(e) => handleTimeoutCallback(e, "checkbox")}
                id={index.toString()}
              />
            }
            key={cntnt.key}
          />
        );
      });

      return (
        <FormGroup>
          {listItems}
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
      <CardContent sx={{ minWidth: "87.5%" }}>{generateContent()}</CardContent>
      <CardInfo />
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
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <CardContentContainer
        id={props.id}
        content={props.card.content}
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
    let cards = projectList[current].cards;
    cards = cards.map((card, index) => {
      if (card) {
        return <GenericCard key={card.key} id={index} card={card} />;
      } else {
        return null;
      }
    });
    return cards;
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
