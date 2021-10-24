import { Typography, Rating } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { SyntheticEvent, useCallback } from "react";

type Props = {
  onUpdate?: (value: number) => void;
  value: number | undefined;
  readOnly?: boolean;
  label: string;
};

const useStyles = makeStyles({
  ratingContainer: {
    padding: 10,
  },
});

const BeerRating = ({ onUpdate, value, readOnly, label }: Props) => {
  const classes = useStyles();

  const handleOnUpdate = useCallback(
    (_: SyntheticEvent<Element, Event>, value: number | null) =>
      onUpdate && onUpdate(value ?? 0),
    [onUpdate]
  );

  return (
    <div className={classes.ratingContainer}>
      <Typography variant="h5">{label}</Typography>
      <Rating readOnly={readOnly} value={value} onChange={handleOnUpdate} />
    </div>
  );
};

export default BeerRating;
