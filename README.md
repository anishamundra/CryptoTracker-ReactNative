# CryptoTracker (React Native)

A cryptocurrency tracker built with React Native, Expo, and Firebase. Made as a project for the Mobile Application Development program at George Brown College.

## About

The app shows the top 50 cryptocurrencies with live prices. You can search for a coin, open its details, and save coins to a favourites list.

## Main features

- Live list of the top 50 coins with price and 24-hour change
- Search by coin name or symbol
- Coin detail screen with price, 24h and 7d change, market cap, volume, and supply
- Favourites list saved in Cloud Firestore

## Tech stack

- React Native, Expo, TypeScript
- React Navigation
- Firebase Cloud Firestore
- CoinLore API for market data

## Getting started

1. Clone this repo and go into the `Crypto` folder.
2. Run `npm install`.
3. Run `npx expo start`, then open the app in Expo Go on your phone or in a simulator.

The favourites feature uses the Firebase config in `src/config/firebaseConfig.ts`. To use your own Firebase project, replace the values in that file and create a Cloud Firestore database.
