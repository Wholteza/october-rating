import { Button, Rating, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Beer, Rating as BeerRating } from "./infrastructure/use-firestore";

type Props = {
  renderedBeers: JSX.Element[];
};

type UserRatings = { [key: string]: BeerRating };
type IsBeerRatedState = { [key: string]: boolean | undefined };

const getAverageWithOneDecimal = (ratings: number[]) =>
  Math.round(
    (ratings.reduce((agg, current): number => {
      return agg + current;
    }, 0) /
      ratings.length) *
      10
  ) / 10;

const IS_BEER_RATED_LOCALSTORAGE_KEY = "IS_BEER_RATED";
const USER_RATINGS_LOCALSTORAGE_KEY = "USER_RATINGS";

const useBeers = (
  beers: Beer[],
  rateBeer: (beerId: string, rating: BeerRating) => Promise<void>
): Props => {
  const [userRatings, setUserRatings] = useState<UserRatings>(() => {
    try {
      const itemInLocalStorage = localStorage.getItem(
        USER_RATINGS_LOCALSTORAGE_KEY
      );
      if (!itemInLocalStorage) return {};
      return JSON.parse(itemInLocalStorage);
    } catch {
      localStorage.removeItem(USER_RATINGS_LOCALSTORAGE_KEY);
      return {};
    }
  });
  const [isBeerRatedState, setIsBeerRatedState] = useState<IsBeerRatedState>(
    () => {
      try {
        const itemInLocalStorage = localStorage.getItem(
          IS_BEER_RATED_LOCALSTORAGE_KEY
        );
        if (!itemInLocalStorage) return {};
        return JSON.parse(itemInLocalStorage);
      } catch {
        localStorage.removeItem(USER_RATINGS_LOCALSTORAGE_KEY);
        return {};
      }
    }
  );

  useEffect(() => {
    const userRatingsIsEmpty = !Object.keys(userRatings);
    if (userRatingsIsEmpty) return;

    localStorage.setItem(
      USER_RATINGS_LOCALSTORAGE_KEY,
      JSON.stringify(userRatings)
    );
  }, [userRatings]);

  const handleAromaUpdate = useCallback(
    (beerId: string, rating: number) => {
      setUserRatings((prev) => {
        var beerRating: BeerRating = userRatings[beerId]
          ? JSON.parse(JSON.stringify(userRatings[beerId]))
          : {
              taste: 0,
              aroma: 0,
              crushability: 0,
              dieHappy: 0,
            };
        beerRating.aroma = rating;
        return { ...prev, [beerId]: beerRating };
      });
    },
    [userRatings]
  );

  const handleCrushabilityUpdate = useCallback(
    (beerId: string, rating: number) => {
      setUserRatings((prev) => {
        var beerRating: BeerRating = userRatings[beerId]
          ? JSON.parse(JSON.stringify(userRatings[beerId]))
          : {
              taste: 0,
              aroma: 0,
              crushability: 0,
              dieHappy: 0,
            };
        beerRating.crushability = rating;
        return { ...prev, [beerId]: beerRating };
      });
    },
    [userRatings]
  );

  const handleTasteUpdate = useCallback(
    (beerId: string, rating: number) => {
      setUserRatings((prev) => {
        var beerRating: BeerRating = userRatings[beerId]
          ? JSON.parse(JSON.stringify(userRatings[beerId]))
          : {
              taste: 0,
              aroma: 0,
              crushability: 0,
              dieHappy: 0,
            };
        beerRating.taste = rating;
        return { ...prev, [beerId]: beerRating };
      });
    },
    [userRatings]
  );
  const handleHappyUpdate = useCallback(
    (beerId: string, rating: number) => {
      setUserRatings((prev) => {
        var beerRating: BeerRating = userRatings[beerId]
          ? JSON.parse(JSON.stringify(userRatings[beerId]))
          : {
              taste: 0,
              aroma: 0,
              crushability: 0,
              dieHappy: 0,
            };
        beerRating.dieHappy = rating;
        return { ...prev, [beerId]: beerRating };
      });
    },
    [userRatings]
  );

  const markBeerAsRated = useCallback((beerId: string) => {
    setIsBeerRatedState((prev) => {
      const newState: IsBeerRatedState = {};
      Object.keys(prev).forEach(
        (key) => (newState[key] = JSON.parse(JSON.stringify(prev[key])))
      );
      newState[beerId] = true;
      localStorage.setItem(
        IS_BEER_RATED_LOCALSTORAGE_KEY,
        JSON.stringify(newState)
      );
      return newState;
    });
  }, []);

  const handleBeerRatingSubmitted = useCallback(
    async (beerId: string) => {
      const rating = userRatings[beerId] ?? {
        aroma: 0,
        crushability: 0,
        dieHappy: 0,
        taste: 0,
      };
      await rateBeer(beerId, rating);
      markBeerAsRated(beerId);
    },
    [markBeerAsRated, rateBeer, userRatings]
  );

  const renderedBeers = useMemo<JSX.Element[]>(
    () =>
      beers.map((b): JSX.Element => {
        const iHaveRatedThisBeer = isBeerRatedState[b.id] ?? false;
        const iHaveNotRatedThisBeer = !iHaveRatedThisBeer;
        return (
          <div>
            <h2>{b.name}</h2>
            <Typography>ABV: {b.abv}%</Typography>
            <div style={{ display: "flex" }}>
              {(b.ratings.length && (
                <div
                  style={{
                    padding: 20,
                  }}
                >
                  <Typography variant="h4" paddingBottom={1}>
                    Average Rating
                  </Typography>
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: 10 }}>
                      <Typography variant="h5">Aroma</Typography>
                      <Rating
                        readOnly
                        value={getAverageWithOneDecimal(
                          b.ratings.flatMap((r) => r.aroma)
                        )}
                      />
                    </div>
                    <div style={{ padding: 10 }}>
                      <Typography variant="h5">Crushability</Typography>
                      <Rating
                        readOnly
                        value={getAverageWithOneDecimal(
                          b.ratings.flatMap((r) => r.crushability)
                        )}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: 10 }}>
                      <Typography variant="h5">Taste</Typography>
                      <Rating
                        readOnly
                        value={getAverageWithOneDecimal(
                          b.ratings.flatMap((r) => r.taste)
                        )}
                      />
                    </div>
                    <div style={{ padding: 10 }}>
                      <Typography variant="h5">Happy</Typography>
                      <Rating
                        readOnly
                        value={getAverageWithOneDecimal(
                          b.ratings.flatMap((r) => r.dieHappy)
                        )}
                      />
                    </div>
                  </div>
                </div>
              )) || <></>}
              {(b.ratingIsOpen && (
                <div style={{ padding: 20 }}>
                  <Typography variant="h4" paddingBottom={1}>
                    {iHaveNotRatedThisBeer
                      ? "Rate this beer"
                      : "You rated this beer"}
                  </Typography>
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: 10 }}>
                      <Typography variant="h5">Aroma</Typography>
                      <Rating
                        readOnly={iHaveRatedThisBeer}
                        value={userRatings[b.id]?.aroma ?? 0}
                        onChange={(_, rating) =>
                          handleAromaUpdate(b.id, rating ?? 0)
                        }
                      />
                    </div>
                    <div style={{ padding: 10 }}>
                      <Typography variant="h5">Crushability</Typography>
                      <Rating
                        readOnly={iHaveRatedThisBeer}
                        value={userRatings[b.id]?.crushability ?? 0}
                        onChange={(_, rating) =>
                          handleCrushabilityUpdate(b.id, rating ?? 0)
                        }
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: 10 }}>
                      <Typography variant="h5">Taste</Typography>
                      <Rating
                        readOnly={iHaveRatedThisBeer}
                        value={userRatings[b.id]?.taste ?? 0}
                        onChange={(_, rating) =>
                          handleTasteUpdate(b.id, rating ?? 0)
                        }
                      />
                    </div>
                    <div style={{ padding: 10 }}>
                      <Typography variant="h5">Happy</Typography>
                      <Rating
                        readOnly={iHaveRatedThisBeer}
                        value={userRatings[b.id]?.dieHappy ?? 0}
                        onChange={(_, rating) =>
                          handleHappyUpdate(b.id, rating ?? 0)
                        }
                      />
                    </div>
                  </div>
                  {(iHaveNotRatedThisBeer && (
                    <>
                      <Typography>You can only rate once</Typography>
                      <Button
                        variant="contained"
                        onClick={() => handleBeerRatingSubmitted(b.id)}
                      >
                        Submit Rating
                      </Button>
                    </>
                  )) || <></>}
                </div>
              )) || <></>}
            </div>
          </div>
        );
      }),
    [
      beers,
      handleAromaUpdate,
      handleBeerRatingSubmitted,
      handleCrushabilityUpdate,
      handleHappyUpdate,
      handleTasteUpdate,
      isBeerRatedState,
      userRatings,
    ]
  );

  return { renderedBeers };
};

export default useBeers;
