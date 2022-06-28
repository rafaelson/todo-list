import logo from "./logo.svg";
import { Box } from "@mui/system";
import React from "react";
import { cloneDeep } from "lodash";
import ProjectDrawer from "./ProjectDrawer";
import HeaderBar from "./HeaderBar";
import ProjectContainer from "./ProjectContainer";

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
