import { DEPARTMENTS, TITLES } from "../constants";

async function fetchRandomUsers(count = 50) {
  const res = await fetch(
    `https://randomuser.me/api/?results=${count}&nat=us,ca,gb,au`
  );
  if (!res.ok) throw new Error("Failed to fetch random users");
  const data = (await res.json()) as { results: Record<string, any>[] };
  return data.results;
}

function enrichUser(u: Record<string, any>, index: number) {
  const name = `${u.name.first} ${u.name.last}`;
  const city = u.location.city;
  const state = u.location.state;
  const country = u.location.country;
  const location = `${city}, ${state}, ${country}`;
  const title = TITLES[index % TITLES.length];
  const department = DEPARTMENTS[index % DEPARTMENTS.length];
  const avatar = u.picture.large;
  const uuid = u.login.uuid;

  return {
    uuid,
    name,
    title,
    department,
    location,
    avatar,
    email: u.email,
  };
}

export async function seedEmployeesFromRandomUser(count = 50) {
  const users = await fetchRandomUsers(count);
  const enriched = users.map((u, i) => enrichUser(u, i));
  return enriched;
}
