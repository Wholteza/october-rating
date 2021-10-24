// Import the functions you need from the SDKs you need
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { useMemo } from "react";
import fireBaseOptions from "./firebase-options.json";

const options: FirebaseOptions = fireBaseOptions;

type Props = {
  app: FirebaseApp;
  analytics: Analytics | undefined;
};

const useFirebase = (): Props => {
  const app = useMemo<FirebaseApp>(() => initializeApp(options), []);
  const analytics = useMemo<Analytics>(() => app && getAnalytics(app), [app]);

  return { app, analytics };
};

export default useFirebase;
