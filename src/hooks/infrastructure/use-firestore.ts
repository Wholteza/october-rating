import { FirebaseApp } from "firebase/app";
import {
  collection,
  Firestore,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  CollectionReference,
  setDoc,
  doc,
  arrayUnion,
  query,
  onSnapshot,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  beers: Beer[];
  getBeers: () => Promise<void>;
  addBeer: (beer: Beer) => Promise<void>;
  rateBeer: (beerId: string, rating: Rating) => Promise<void>;
};

export type Beer = {
  id: string;
  name: string;
  style: string;
  abv: number;
  ratings: Rating[];
  ratingIsOpen: boolean;
};

export type Rating = {
  taste: number;
  aroma: number;
  crushability: number;
  dieHappy: number;
};
const BEER_COLLECTION_PATH = "beers";
const beerConverter = (): FirestoreDataConverter<Beer> => ({
  toFirestore: (modelObject: WithFieldValue<Beer>): DocumentData => ({
    name: modelObject.name,
    style: modelObject.style,
    abv: modelObject.abv,
    ratings: modelObject.ratings,
    ratingIsOpen: modelObject.ratingIsOpen,
  }),
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Beer,
});

const useFirestore = (app: FirebaseApp): Props => {
  const [beers, setBeers] = useState<Beer[]>([]);

  const db = useMemo<Firestore>(() => getFirestore(app), [app]);
  const beersCollectionReference = useMemo<CollectionReference<Beer>>(
    () =>
      collection(db, BEER_COLLECTION_PATH).withConverter<Beer>(beerConverter()),
    [db]
  );

  useEffect(() => {
    if (!db || !beersCollectionReference) return;
    const q = query(beersCollectionReference);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const beers: Beer[] = [];
      querySnapshot.forEach((doc) => beers.push({ ...doc.data(), id: doc.id }));
      setBeers(beers);
    });
    return () => unsubscribe();
  }, [beersCollectionReference, db]);

  const addBeer = useCallback(
    async (beer: Beer) => {
      await setDoc(doc(beersCollectionReference), beer);
    },
    [beersCollectionReference]
  );

  const getBeers = useCallback(async () => {
    const beersSnapshot = await getDocs(beersCollectionReference);
    const beers = beersSnapshot.docs.map(
      (doc): Beer => ({ ...doc.data(), id: doc.id })
    );
    setBeers(beers);
  }, [beersCollectionReference]);

  const rateBeer = useCallback(
    async (beerId: string, rating: Rating) => {
      const beerRef = doc(db, BEER_COLLECTION_PATH, beerId);
      await setDoc(
        beerRef,
        { ratings: arrayUnion(rating) },
        {
          merge: true,
        }
      );
      await getBeers();
    },
    [db, getBeers]
  );

  useEffect(() => {
    getBeers();
  }, [getBeers]);

  return { getBeers, addBeer, beers, rateBeer };
};

export default useFirestore;
