<br />
<div align="center">
  <a href="https://github.com/teyweikiet/llm-data-collection-prototype-bounty" style="background: black; color: white;">
    <img src="next-pwa/public/android-chrome-192x192.png" alt="Logo" width="50" height="auto" style="color=white;">
  </a>

  <h1 align="center" style="border-bottom: 0;">The Language Exchange App</h1>

  <p align="center">
    A fullstack language exchange app prototype.
    <br />
    <a href="https://llm-data-collection-prototype-bounty.vercel.app/"><strong>View Demo</strong></a>
    <br />
  </p>
</div>

## About the project

Submission for [StackUp's Bounty Challenge - Creating a Data Collection Prototype](https://community.campus.dev/web?sid=space_16a69442-cb83-4027-85b0-ca5f1d7e650b&target_path=%2Flearners%2Fcampaigns%2Fbridging-the-sea-data-divide-bounty%2Fquests%2Fbounty-challenge-2-creating-a-data-collection-prototype-b3dd).

## Features

- user can set languages they are fluent in

- user can submit content in languages they are learning to get feedback from other users who know the language fluently

- user will be shown other users' contents based on languages they are fluent in. For example, if I am fluent in Malay, I will be shown other users' contents in Malay which needs feedbacks


## How this app can help collecting data that has SEA context

- while this app can be used by users fluent in & learning any languages in the world, the data submitted are tagged with the language used, this allow easy data extraction down the pipeline to extract only content with SEA context

- while content submitted by language learner may not be of high quality, the app is designed so that another user who the language fluently will be able to submit their own version of the content, this will allow us to get better quality data

- since all the data are still crowdsourced, more features may be added e.g. 'report abuse' to help moderate the content submitted by either learners or evaluators


## Instruction to take a quick tour of the app

1. register [here](https://llm-data-collection-prototype-bounty.vercel.app/register)

2. after registration, you will be redirected to [profile page](https://llm-data-collection-prototype-bounty.vercel.app/profile)

3. fill up your details, you can choose languages you are fluent in e.g. Malay

4. then you can submit a content in your chosen language e.g. Tagalog. after submission, you will be able to see all your submissions at [home page](https://llm-data-collection-prototype-bounty.vercel.app/)

5. now register another account and choose the same language as Step (4) as one of the languages you are fluent in

6. then at home page, you can go to "Other's submissions" tab, and you will see the content submitted using the first account in step 4

7. click on the submission and you will be presented with a form to give a feedback since you are fluent in the language of the submission

8. after saving the submission, log in again using the first account and you will be able to see the feedback submitted using the second account


## Built with

- [Supabase](https://supabase.com/) - scalable, performant Backend as a Service powered by Postgres database - the world's most trusted relational database

- [Next.js](https://nextjs.org/)

- [Mantine](https://mantine.dev/)

- [@ducanh2912/next-pwa](https://www.npmjs.com/package/@ducanh2912/next-pwa)


## Running locally

- Clone the repo
- Install dependencies
- Make sure docker is running and start supabase locally
```sh
npm run supabase:start
```
- Apply migration
```sh
npm run supabase:migration:up
```
- Change directory to `/next-pwa` and install dependencies
```sh
cd next-pwa
npm i
```
- Set up `.env` by copying `.env.example` and modifying accordingly
```sh
cp .env.example .env
```
- Start frontend
```sh
npm run dev
```
