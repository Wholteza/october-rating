import { Button, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useCallback, useMemo } from "react";
import {
  Beer as BeerModel,
  Rating as BeerRatingModel,
} from "../hooks/infrastructure/use-firestore";
import BeerRating from "./beer-rating";

const getAverageWithOneDecimal = (ratings: number[]) =>
  Math.round(
    (ratings.reduce((agg, current): number => {
      return agg + current;
    }, 0) /
      ratings.length) *
      10
  ) / 10;

type Props = {
  beer: BeerModel;
  hasBeenRated: boolean;
  userRating: BeerRatingModel;
  onAromaUpdate: (value: number) => void;
  onTasteUpdate: (value: number) => void;
  onHappyUpdate: (value: number) => void;
  onCrushabilityUpdate: (value: number) => void;
  onRatingSubmitted: () => Promise<void>;
};

const useStyles = makeStyles((theme: Theme) => ({
  beerContainer: {
    marginTop: 50,
  },
  ratingsContainer: {
    display: "flex",
    flexDirection: "column",
  },
  ratingsSection: {
    padding: 20,
  },
  ratingsSectionRow: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  ratingColumnHeader: {
    paddingBottom: 5,
  },
}));

const Beer = ({
  beer,
  hasBeenRated,
  userRating: propsUserRating,
  onAromaUpdate,
  onCrushabilityUpdate,
  onHappyUpdate,
  onTasteUpdate,
  onRatingSubmitted,
}: Props) => {
  const classes = useStyles();

  const hasNotBeenRated = useMemo<boolean>(() => !hasBeenRated, [hasBeenRated]);

  const userRating = useMemo<BeerRatingModel>(
    () => ({
      aroma: propsUserRating?.aroma ?? 0,
      crushability: propsUserRating?.crushability ?? 0,
      dieHappy: propsUserRating?.dieHappy ?? 0,
      taste: propsUserRating?.taste ?? 0,
    }),
    [
      propsUserRating?.aroma,
      propsUserRating?.crushability,
      propsUserRating?.dieHappy,
      propsUserRating?.taste,
    ]
  );

  const averageRatings = useMemo<BeerRatingModel>(
    () => ({
      aroma: getAverageWithOneDecimal(beer.ratings.flatMap((r) => r.aroma)),
      crushability: getAverageWithOneDecimal(
        beer.ratings.flatMap((r) => r.crushability)
      ),
      dieHappy: getAverageWithOneDecimal(
        beer.ratings.flatMap((r) => r.dieHappy)
      ),
      taste: getAverageWithOneDecimal(beer.ratings.flatMap((r) => r.taste)),
    }),
    [beer.ratings]
  );

  const handleOnRatingSubmitted = useCallback(
    async () => await onRatingSubmitted(),
    [onRatingSubmitted]
  );

  const yourRating = useMemo<number>(() => {
    return (
      userRating.aroma +
      userRating.crushability +
      userRating.dieHappy +
      userRating.taste
    );
  }, [
    userRating.aroma,
    userRating.crushability,
    userRating.dieHappy,
    userRating.taste,
  ]);
  const totalAverage = useMemo<number>(() => {
    const total = beer.ratings.reduce<number[]>((aggregate, current) => {
      return [
        ...aggregate,
        current.aroma + current.crushability + current.dieHappy + current.taste,
      ];
    }, []);
    return getAverageWithOneDecimal(total);
  }, [beer.ratings]);

  return (
    <div className={classes.beerContainer}>
      <Typography>{beer.brewery}</Typography>
      <Typography variant="h3">{beer.name}</Typography>
      <Typography>
        {beer.style} | {beer.abv}%
      </Typography>
      <div className={classes.ratingsContainer}>
        {(!beer.ratingIsOpen && !beer.ratings.length && (
          <Typography variant="subtitle1">Rating is not open yet</Typography>
        )) || <></>}
        {beer.ratingIsOpen && (
          <div className={classes.ratingsSection}>
            <Typography variant="h4" className={classes.ratingColumnHeader}>
              {hasNotBeenRated
                ? "Rate this beer"
                : `Your rating - ${yourRating}`}
            </Typography>
            <div className={classes.ratingsSectionRow}>
              <BeerRating
                label="Aroma"
                value={userRating.aroma}
                key="Aroma"
                onUpdate={onAromaUpdate}
              />
              <BeerRating
                label="Crushability"
                value={userRating.crushability}
                key="Crushability"
                onUpdate={onCrushabilityUpdate}
              />
              <BeerRating
                label="Taste"
                value={userRating.taste}
                key="Taste"
                onUpdate={onTasteUpdate}
              />
              <BeerRating
                label="Happy"
                value={userRating.dieHappy}
                key="Happy"
                onUpdate={onHappyUpdate}
              />
            </div>
            {(hasNotBeenRated && (
              <>
                <Typography>You can only rate once</Typography>
                <Button variant="contained" onClick={handleOnRatingSubmitted}>
                  Submit Rating
                </Button>
              </>
            )) || <></>}
          </div>
        )}
        {(beer.ratings.length && (
          <div className={classes.ratingsSection}>
            <Typography variant="h4" className={classes.ratingColumnHeader}>
              {`Crowd Rating - ${totalAverage}`}
            </Typography>
            <div className={classes.ratingsSectionRow}>
              <BeerRating
                label="Aroma"
                value={averageRatings.aroma}
                readOnly={true}
                key="Aroma"
              />
              <BeerRating
                label="Crushability"
                value={averageRatings.crushability}
                readOnly={true}
                key="Crushability"
              />
              <BeerRating
                label="Taste"
                value={averageRatings.taste}
                readOnly={true}
                key="Taste"
              />
              <BeerRating
                label="Happy"
                value={averageRatings.dieHappy}
                readOnly={true}
                key="Happy"
              />
            </div>
          </div>
        )) || <></>}
      </div>
    </div>
  );
};

export default Beer;
