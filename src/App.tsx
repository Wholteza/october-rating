import useFirebase from "./hooks/infrastructure/use-firebase";
import useFirestore from "./hooks/infrastructure/use-firestore";
import { createTheme, Typography } from "@mui/material";
import LoopSharpIcon from "@mui/icons-material/LoopSharp";
import { makeStyles, ThemeProvider } from "@mui/styles";
import useBeers from "./hooks/use-beers";
import RatingHelp from "./components/rating-help";

const useStyles = makeStyles({
  app: {
    textAlign: "center",
    backgroundColor: "#282c34",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
  },
  rotateIcon: {
    animation: "spin 4s linear infinite",
    marginTop: 100,
  },
  helpSection: {
    marginTop: 50,
  },
});

function App() {
  const classes = useStyles();
  const theme = createTheme({});

  const { app } = useFirebase();
  const { beers, rateBeer } = useFirestore(app);

  const { renderedBeers } = useBeers(beers, rateBeer);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.app}>
        <Typography variant="h1">Octoberfest</Typography>
        <Typography variant="h4">
          Rate your beers and see what others think
        </Typography>

        {beers.length ? (
          renderedBeers
        ) : (
          <LoopSharpIcon fontSize="large" className={classes.rotateIcon} />
        )}
        <RatingHelp className={classes.helpSection} />
      </div>
    </ThemeProvider>
  );
}

export default App;
