import logo from "./logo.svg";
import "./App.css";
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
} from "@mui/material";
import { Box } from "@mui/system";
import { Add, Delete, AccessTime, MoreVert } from "@mui/icons-material";
import React, { Fragment, useState } from "react";

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
            props.addProject(name);
          }}
        >
          Create
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
        addProject={props.addProject}
      />
    </Fragment>
  );
}

function Project(props) {
  return (
    <ListItem>
      <ListItemButton>
        <ListItemText primary={props.name} />
      </ListItemButton>
    </ListItem>
  );
}

function ProjectList(props) {
  const renderProjects = () => {
    let projectelements = props.projects.map((project, index) => {
      return <Project name={project.name} key={index} />;
    });
    return projectelements;
  };

  return (
    <List>
      {renderProjects()}
      <AddProjectButton addProject={props.addProject} />
    </List>
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
        <ProjectList projects={props.projects} addProject={props.addProject} />
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

function ProjectContainer() {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <CardContainer />
    </Box>
  );
}

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    const storage = JSON.parse(localStorage.getItem("projects"));
    if (storage) {
      this.setState({ projects: storage });
    } else {
      this.setState(this.addProject("Default project"));
    }
  }

  componentDidUpdate() {
    localStorage.setItem("projects", JSON.stringify(this.state.projects));
  }

  addProject(name) {
    if (name === "") {
      name = `New project ${this.state.projects.length}`;
    }
    let newState = this.state.projects.concat({
      name: name,
      cards: [],
      id: this.state.projects.length,
    });
    this.setState({ projects: newState });
  }

  render() {
    return (
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <HeaderBar />
        <ProjectDrawer
          projects={this.state.projects}
          addProject={(name) => this.addProject(name)}
        />
        <ProjectContainer />
      </Box>
    );
  }
}

function App() {
  return <AppContainer />;
}

export default App;
