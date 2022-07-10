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
      projects: [{ name: "Default project", cards: [...Array(0)], id: 0 }],
      currentProject: 0,
    };
  }

  componentDidMount() {
    const storage = JSON.parse(localStorage.getItem("projects"));
    const current = Number(localStorage.getItem("current"));
    if (storage) {
      this.setState({ projects: storage });
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
      cards: [...Array(0)],
      id: this.state.projects.length,
    });
    this.setState({ projects: newState });
  }

  addCard(id, type) {
    let newState = cloneDeep(this.state.projects);
    let card = { content: undefined, type: type };
    if (type === "checklist") {
      card.content = [...Array(0)];
    }
    newState[id].cards.push(card);
    this.setState({ projects: newState });
  }

  updateCard(id, cardId, content, type, checkboxId) {
    let newState = cloneDeep(this.state.projects);
    // new checkbox
    if (type === "checklist" && checkboxId === undefined) {
      newState[id].cards[cardId].content.push(content);
    }
    // update existing checkbox
    else if (type === "checklist" && checkboxId >= 0) {
      newState[id].cards[cardId].content[checkboxId].label = content;
    } else {
      newState[id].cards[cardId].content = content;
    }
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
        <HeaderBar
          project={{
            addCard: (id, card) => this.addCard(id, card),
            current: this.state.currentProject,
          }}
        />
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
            updateCard: (id, cardId, content, type, checkboxId) =>
              this.updateCard(id, cardId, content, type, checkboxId),
            current: this.state.currentProject,
            list: this.state.projects,
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
