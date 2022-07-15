import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  DialogContent,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Fragment, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { projectContext } from "./App";

function AddCardForm(props) {
  const [value, setValue] = useState(undefined);
  const current = useContextSelector(
    projectContext,
    (project) => project.current
  );
  const addCard = useContextSelector(
    projectContext,
    (project) => project.addCard
  );

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Create a new card</DialogTitle>
      <DialogContent>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <RadioGroup onChange={handleChange}>
            <FormControlLabel
              value="checklist"
              control={<Radio />}
              label="Checklist"
            />
            <FormControlLabel value="note" control={<Radio />} label="Note" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (value) {
              props.handleClose();
              addCard(current, value);
            }
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AddCardButton(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <IconButton onClick={handleClickOpen}>
        <Add />
      </IconButton>
      <AddCardForm open={open} handleClose={handleClose} />
    </Fragment>
  );
}

function HeaderBar(props) {
  return (
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5">ToDo App</Typography>
        <AddCardButton />
      </Toolbar>
    </AppBar>
  );
}

export default HeaderBar;
