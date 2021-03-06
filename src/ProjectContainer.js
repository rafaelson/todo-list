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
  Clear,
  ClearRounded,
} from "@mui/icons-material";
import uniqid from "uniqid";
import { projectContext } from "./App";
import { useRef } from "react";
import { useEffect } from "react";

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
