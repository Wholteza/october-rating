# october-rating

Web app where you can rate beers including the categories:

- Taste
- Aroma
- Crushability: Can you drink a lot of it
- Happy: If you could only drink this beer for the rest of your life, would you die a happy human?

Tested out using firebase for this one:

- Authentication: Anonoymous, you add beers in the firebase console firestore editor.
- Access control: Firestore rules make sure users can only send in new ratings.
- Storage: Firestore

### Getting started

1.  Create a Firebase project in the [Firebase Console](https://console.firebase.google.com).
1.  In the Firebase console, enable Anonymous authentication on your project by doing: **Authentication > SIGN-IN METHOD > Anonymous > Enable > SAVE**
1.  In the Firebase console, enable Firestore on your project by clicking **Create Database** in the **Cloud Firestore** section of the console and answering all prompts.
1.  Copy/Download this repo and open this folder in a Terminal.
1.  Install the Firebase CLI if you do not have it installed on your machine:
    ```bash
    npm -g i firebase-tools
    ```
1.  Set the CLI to use the project you created on step 1:
    ```bash
    firebase use --add
    ```
1.  Deploy the Firestore security rules and indexes:
    ```bash
    firebase deploy --only firestore
    ```
1.  Copy your projects app configuration from the firebase console, **Add app > Web > Give nickname > Copy settings object**, paste it into the `firebase-options.json`, DON'T commit this.
1.  Run a local server:
    ```bash
    yarn start
    ```

### Deploying to firebase

1.  Run the all in one command, make sure you are using the correct firebase project using `firebase --use` prior to running this:
    ```bash
    yarn deploy
    ```

### TODO

- add diagrams
  - average score per user, breakdown of total
  - per beer, positives neutral negatives 12, 3, 45
  - How much the average rating went up, or down while drinking.
    - x: ppm alcohol/blood
    - y: rating increase/decrease
