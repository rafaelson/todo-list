import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  ListItem,
  IconButton,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Drawer,
  Toolbar,
} from "@mui/material";
import {
  Add,
  DriveFileRenameOutline,
  Delete,
  MoreVert,
  DeleteOutline,
} from "@mui/icons-material";
import { useState, useEffect, Fragment } from "react";
import { useContextSelector } from "use-context-selector";
import { Box } from "@mui/system";
import { projectContext } from "./App";

const drawerWidth = "240px";

function AddProjectForm(props) {
  const [name, setName] = useState("");
  const addProject = useContextSelector(
    projectContext,
    (project) => project.add
  );

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Create a new project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="project name"
          label="Project name"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            props.handleClose();
            addProject(name);
            setName("");
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function RenameProjectForm(props) {
  const [name, setName] = useState("");
  const renameProject = useContextSelector(
    projectContext,
    (project) => project.rename
  );
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Rename project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="project name"
          label="Project name"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            props.handleClose();
            renameProject(props.id, name);
            setName("");
          }}
        >
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AddProjectButton(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <ListItem sx={{ justifyContent: "flex-end" }}>
        <IconButton onClick={handleClickOpen}>
          <Add />
        </IconButton>
      </ListItem>
      <AddProjectForm open={open} handleClose={handleClose} />
    </Fragment>
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
          <DriveFileRenameOutline /> Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteProject(props.anchorEl.id);
            props.handleClose();
          }}
        >
          <DeleteOutline /> Delete
        </MenuItem>
      </Menu>
      <RenameProjectForm open={open} handleClose={handleFormClose} id={id} />
    </Fragment>
  );
}

function ProjectList(props) {
  const [view, setView] = useState(0);
  const [anchorEl, setAnchorEl] = useState(false);

  const current = useContextSelector(
    projectContext,
    (project) => project.current
  );

  const projectList = useContextSelector(
    projectContext,
    (project) => project.list
  );

  const setCurrent = useContextSelector(
    projectContext,
    (project) => project.setCurrent
  );
  const open = Boolean(anchorEl);

  // Keep selected project between reloads
  useEffect(() => {
    if (view !== current) {
      setView(current);
    }
  }, [current, view]);

  const mouseDown = (e) => {
    e.stopPropagation();
    handleClick(e);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, change) => {
    if (change != null) {
      setView(change);
      setCurrent(event.target.value);
    }
  };

  const renderProjects = () => {
    let projectElements = projectList.map((project, index) => {
      return (
        <ToggleButton
          value={index}
          key={project.key}
          sx={{ justifyContent: "space-between" }}
        >
          {project.name}
          <IconButton id={index} onClick={mouseDown}>
            <MoreVert />
          </IconButton>
        </ToggleButton>
      );
    });
    return projectElements;
  };

  return (
    <Fragment>
      <ToggleButtonGroup
        orientation="vertical"
        value={view}
        exclusive
        onChange={handleChange}
        fullWidth={true}
      >
        {renderProjects()}
      </ToggleButtonGroup>
      <AddProjectButton />
      <ProjectOptionsMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
      />
    </Fragment>
  );
}

function ProjectDrawer(props) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <ProjectList />
      </Box>
    </Drawer>
  );
}

export default ProjectDrawer;
