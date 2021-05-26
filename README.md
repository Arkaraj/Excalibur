# Excalibur

A Social media app made with React Native, Redux, Basically an instagram mini clone

Run on Expo

🚧🚧 Work on Progress (1-2 commit more to go...) 🚧🚧

## Tech Stack

- React Native (Expo CLI)
- Redux for State Management
- Firebase & FireStore for database and Storing images (or may just end up making a real server in NodeJS...)

## Features

- Post Images/Pics from Camera or Phone Gallery
- Search Users
- Profile Page with all posted images
- Follow, UnFollow other users
- See Following User's Images on the Feed
- Comment on User's Pictures
- Like/Dislike User's Posted Pictures

# Things Need To Be Done

- Fix Bugs & Testing Few Features
- Firebase deploy
- Full UI/UX design, refactoring code
- Maybe a Chat Feature with other users

## To Run it Locally

```sh
npm i
```

Add a secret.js file,

```js
export const firebaseConfig = {
  apiKey: " ",
  authDomain: " ",
  projectId: " ",
  storageBucket: " ",
  messagingSenderId: " ",
  appId: " ",
  measurementId: " ",
};
```

Create a secret.js file in root directory (.env is recommended), add the firebase configuration credentials there.
