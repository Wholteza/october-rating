## Todo

### Outside of app

- Fix beer issue, out of stock
- Collect info about beers
- Create plan for tasting, 2 sessions

### Inside of app

- upload to repo
- Add functionality to list beers with ratings (averages)
- Add functionality to rate a beer
  - bonus to block multiple rates
- add diagrams
  - average score per user, breakdown of total
  - per beer, positives neutral negatives 12, 3, 45
  - How much the average rating went up, or down while drinking.
    - x: ppm alcohol/blood
    - y: rating increase/decrease
- add db rule to only write ratings

- add google login to add admin page

## Setup and run the app

**You can just run yarn start since i have included settings**

Follow these steps to setup and run the quickstart:

1.  Create a Firebase project in the [Firebase Console](https://console.firebase.google.com).
1.  In the Firebase console, enable Anonymous authentication on your project by doing: **Authentication > SIGN-IN METHOD > Anonymous > Enable > SAVE**
1.  In the Firebase console, enable Firestore on your project by clicking **Create Database** in the **Cloud Firestore** section of the console and answering all prompts.
    1.  Select testing mode for the security rules
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
1.  Run a local server:
    ```bash
    yarn start
    ```
