import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";

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

export default HeaderBar;
