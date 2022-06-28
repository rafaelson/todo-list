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
} from "@mui/material";
import { Box } from "@mui/system";
import { Fragment } from "react";
import { AccessTime, MoreVert, Add } from "@mui/icons-material";

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

function CardContainer(props) {
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

export default ProjectContainer;
