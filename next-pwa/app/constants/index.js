import { countries, languages } from "countries-list";

export const countryOptions = Object.values(countries)
  .map(({ name }) => name)
  .sort((a, b) => a.localeCompare(b));

export const languageOptions = Object.values(languages)
  .map(({ name }) => name)
  .sort((a, b) => a.localeCompare(b));
