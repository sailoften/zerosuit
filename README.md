# Muddy

Mud mobile app

## Running the app in your local development environment

Requirements:
- Node 16.20.2

First, load Doppler and use `mono/dev`

```
doppler setup
```

Then, sync up environmental variables. If you don't have yarn, run `npm install yarn -g`. We use Yarn v1

```
yarn doppler:env
```

Install (and also generates GraphQL)

```
yarn
```

Start Expo Dev

```
npx expo start
```
