import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

type Props = {
  className?: string;
};

const useStyles = makeStyles({
  header: {
    paddingBottom: 15,
  },
});

const RatingHelp = ({ className }: Props) => {
  const classes = useStyles();

  return (
    <div className={className}>
      <Typography variant="h2" className={classes.header}>
        What are those odd categories
      </Typography>
      <Typography variant="body1">
        Happy - If you could only drink this one beer for the rest of your life,
        would you die a happy human?
      </Typography>
      <Typography variant="body1">
        Crushability - Is this a beer that you could drink a lot of (crush)
        during one evening
      </Typography>
    </div>
  );
};

export default RatingHelp;
