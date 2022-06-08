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
} from "@mui/material";
import { Box } from "@mui/system";
import { Add, Delete } from "@mui/icons-material";
import { Fragment } from "react";

const drawerWidth = "240px";
const card = (
  <Fragment>
    <CardContent>
      <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
        <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
      </FormGroup>
      {/* <Typography>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti,
        tempora. Vel, aliquam. Distinctio saepe quos maiores vel hic cum rerum
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti,
        tempora. Vel, aliquam. Distinctio saepe quos maiores vel hic cum rerum
        nemo illum molestias sed, amet iure fugit reiciendis deleniti. Quaerat.
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti,
        tempora. Vel, aliquam. Distinctio saepe quos maiores vel hic cum rerum
        nemo illum molestias sed, amet iure fugit reiciendis deleniti. Quaerat.
      </Typography> */}
    </CardContent>
    <CardActions sx={{ justifyContent: "flex-end" }}>
      <IconButton>
        <Add />
      </IconButton>
    </CardActions>
  </Fragment>
);

function App() {
  return (
    <div className="App">
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
            <Typography variant="h5">ToDo App</Typography>
            <IconButton>
              <Add />
            </IconButton>
          </Toolbar>
        </AppBar>
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
            <List>
              <ListItem>
                <ListItemButton>
                  <ListItemText primary="Default project" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemButton>
                  <ListItemText primary="Default project" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemButton>
                  <ListItemText primary="Default project" />
                </ListItemButton>
              </ListItem>
              <ListItem sx={{ justifyContent: "flex-end" }}>
                <IconButton>
                  <Add />
                </IconButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Box
            sx={{
              display: "grid",
              gap: 5,
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 250px))",
            }}
          >
            <Card
              variant="outlined"
              sx={{
                minWidth: 230,
                maxWidth: 280,
                height: 300,
                overflow: "auto",
              }}
            >
              {card}
            </Card>
            <Card
              variant="outlined"
              sx={{
                minWidth: 230,
                maxWidth: 280,
                height: 300,
                overflow: "auto",
              }}
            >
              {card}
            </Card>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
