import useFirebase from "./hooks/infrastructure/use-firebase";
import useFirestore from "./hooks/infrastructure/use-firestore";
import { Typography } from "@mui/material";
import LoopSharpIcon from "@mui/icons-material/LoopSharp";
import { makeStyles } from "@mui/styles";
import useBeers from "./hooks/use-beers";
import RatingHelp from "./components/rating-help";

const useStyles = makeStyles({
  app: {
    textAlign: "center",
  },
  header: {
    backgroundColor: "#282c34",
    minHeight: "100vh",
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

  const { app } = useFirebase();
  const { beers, rateBeer } = useFirestore(app);

  const { renderedBeers } = useBeers(beers, rateBeer);

  return (
    <div className={classes.app}>
      <header className={classes.header}>
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
      </header>
    </div>
  );
}

export default App;
