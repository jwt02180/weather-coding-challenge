This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Welcome!
My name is [Jameson Taylor](https://www.linkedin.com/in/jameson-w-taylor/), and this repository is the result of completing a code challenge.

### Requirements
I was tasked with creating a weather app that satisfied the following criteria:
- Leverage [OpenWeatherAPI](https://openweathermap.org/api) to display a 5-day weather forecast in 3-hour increments for any specified US zip code.
- The app should use SSR, with each page displaying the forecast data.
- The project should use the URL structure /weather/[zip] to fetch and display weather data for any US zip code.
- Which framework I used was up to me to choose, but should includ Typescript.
- The UI design should be immediately intuitive and easy to navigate.
- Timebox this effort to only a few hours

### Extra Credit
I wanted to take this opportunity to challenge myself and try using some things I was unfamiliar with, for which I decided to build this with the newer NextJS [App Router](https://nextjs.org/docs/app) with [React Server Components](https://19.react.dev/reference/rsc/server-components#noun-labs-1201738-(2)).

### Notes
Given the advances in AI assistive technology lately, I feel that it's important to note that this project was hand-crafted by me. For technical assignments like this, that don't specifically ask for generative AI *to* be used, I prefer to leave it out of the process in order to accurately present my skills.

### See It live
This project has been deployed to Vercel, and includes server-side and client-side validation of the zip code. The client-side validation provides realtime feedback as you type a zip into the search input. To see the server-side validation results you can try several scenarios to see this in action:
- No zip code -> [try me](https://weather-coding-challenge.vercel.app/weather)
- Invalid zip code -> [try me](https://weather-coding-challenge.vercel.app/weather/abcdef)
- Zip code not found -> [try me](https://weather-coding-challenge.vercel.app/weather/99999)
- Valid & found zip code -> [try me](https://weather-coding-challenge.vercel.app/weather/90210)

### Final Thoughts
Thank you for taking the time to review my work, and I look forward to continuing onto the next step!

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
