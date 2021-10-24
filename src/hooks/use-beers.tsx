import { useCallback, useEffect, useMemo, useState } from "react";
import BeerComponent from "../components/beer";
import { Beer, Rating as BeerRating } from "./infrastructure/use-firestore";

type Props = {
  renderedBeers: JSX.Element[];
};

type UserRatings = { [key: string]: BeerRating };
type IsBeerRatedState = { [key: string]: boolean | undefined };

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

  const handleOnAromaUpdate = useCallback(
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

  const handleOnCrushabilityUpdate = useCallback(
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

  const handleOnTasteUpdate = useCallback(
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
  const handleOnHappyUpdate = useCallback(
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

  const handleOnRatingSubmitted = useCallback(
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
        const hasBeenRated = isBeerRatedState[b.id] ?? false;
        return (
          <BeerComponent
            key={b.id}
            beer={b}
            hasBeenRated={hasBeenRated}
            userRating={userRatings[b.id]}
            onAromaUpdate={(value: number) => handleOnAromaUpdate(b.id, value)}
            onCrushabilityUpdate={(value: number) =>
              handleOnCrushabilityUpdate(b.id, value)
            }
            onHappyUpdate={(value: number) => handleOnHappyUpdate(b.id, value)}
            onTasteUpdate={(value: number) => handleOnTasteUpdate(b.id, value)}
            onRatingSubmitted={async () => await handleOnRatingSubmitted(b.id)}
          />
        );
      }),
    [
      beers,
      handleOnAromaUpdate,
      handleOnRatingSubmitted,
      handleOnCrushabilityUpdate,
      handleOnHappyUpdate,
      handleOnTasteUpdate,
      isBeerRatedState,
      userRatings,
    ]
  );

  return { renderedBeers };
};

export default useBeers;
