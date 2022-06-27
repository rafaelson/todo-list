import logo from "./logo.svg";
import {
  Drawer,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemButton,
  AppBar,
  Toolbar,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem,
  Fade,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  Add,
  Delete,
  AccessTime,
  MoreVert,
  DriveFileRenameOutline,
} from "@mui/icons-material";
import React, { Fragment, useState, useEffect } from "react";
import { cloneDeep } from "lodash";

const drawerWidth = "240px";

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

function CardContentContainer() {
  return (
    <Fragment>
      <CardContent>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Label"
          />
          <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
        </FormGroup>
        {/* <Typography>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti,
            tempora.
          </Typography> */}
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <IconButton>
          <Add />
        </IconButton>
      </CardActions>
      <CardInfo />
    </Fragment>
  );
}

function GenericCard() {
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
      <CardContentContainer />
    </Card>
  );
}

function HeaderBar() {
  return (
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5">ToDo App</Typography>
        <IconButton>
          <Add />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

function AddProjectForm(props) {
  const [name, setName] = useState("");

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
            props.project.add(name);
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
            props.project.rename(props.id, name);
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
      <AddProjectForm
        open={open}
        handleClose={handleClose}
        project={props.project}
      />
    </Fragment>
  );
}

function ProjectOptionsMenu(props) {
  const [open, setOpen] = useState(false);
  const [id, setID] = useState(null);

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
            props.project.delete(props.anchorEl.id);
            props.handleClose();
          }}
        >
          <Delete /> Delete
        </MenuItem>
      </Menu>
      <RenameProjectForm
        open={open}
        handleClose={handleFormClose}
        project={props.project}
        id={id}
      />
    </Fragment>
  );
}

function ProjectList(props) {
  const [view, setView] = useState(0);
  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);

  // Keep selected project between reloads
  useEffect(() => {
    if (view !== props.project.current) {
      setView(props.project.current);
    }
  }, [props.project, view]);

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
      props.project.setCurrent(event.target.value);
    }
  };

  const renderProjects = () => {
    let projectElements = props.project.list.map((project, index) => {
      return (
        <ToggleButton
          value={index}
          key={index}
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
      <AddProjectButton project={props.project} />
      <ProjectOptionsMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        project={props.project}
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
        <ProjectList project={props.project} />
      </Box>
    </Drawer>
  );
}

function CardContainer() {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 5,
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 250px))",
      }}
    >
      <GenericCard />
      <GenericCard />
    </Box>
  );
}

function ProjectContainer(props) {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <CardContainer project={props.project} />
    </Box>
  );
}

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      currentProject: 0,
    };
  }

  componentDidMount() {
    const storage = JSON.parse(localStorage.getItem("projects"));
    const current = Number(localStorage.getItem("current"));
    if (storage) {
      this.setState({ projects: storage });
    } else {
      this.setState(this.addProject("Default project"));
    }
    if (current) {
      this.setState({ currentProject: current });
    }
  }

  componentDidUpdate() {
    localStorage.setItem("projects", JSON.stringify(this.state.projects));
    localStorage.setItem("current", this.state.currentProject);
  }

  addProject(name) {
    if (name === "") {
      name = `New project ${this.state.projects.length + 1}`;
    }
    let newState = this.state.projects.concat({
      name: name,
      cards: [],
      id: this.state.projects.length,
    });
    this.setState({ projects: newState });
  }

  renameProject(id, name) {
    let newState = cloneDeep(this.state.projects);
    newState[id].name = name;
    this.setState({ projects: newState });
  }

  deleteProject(id) {
    let newState = cloneDeep(this.state.projects);
    newState.splice(id, 1);
    this.setState({ projects: newState });
    if (this.state.currentProject > 0 && id == this.state.currentProject) {
      this.setState({ currentProject: this.state.currentProject - 1 });
    }
  }

  render() {
    return (
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <HeaderBar />
        <ProjectDrawer
          project={{
            add: (name) => this.addProject(name),
            rename: (id, name) => this.renameProject(id, name),
            delete: (id) => this.deleteProject(id),
            setCurrent: (id) => this.setState({ currentProject: Number(id) }),
            current: this.state.currentProject,
            list: this.state.projects,
          }}
        />
        <ProjectContainer
          project={{
            list: this.state.projects,
            current: this.state.currentProject,
          }}
        />
      </Box>
    );
  }
}

function App() {
  return <AppContainer />;
}

export default App;
