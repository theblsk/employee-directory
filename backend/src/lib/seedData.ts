import { DEPARTMENTS, TITLES } from "../constants";

async function fetchRandomUsers(numberOfUsers = 50) {
  const response = await fetch(
    `https://randomuser.me/api/?results=${numberOfUsers}&nat=us,ca,gb,au` // Fine to be hardcoded
  );
  if (!response.ok) throw new Error("Failed to fetch random users");
  const responseData = (await response.json()) as { results: Record<string, any>[] };
  return responseData.results;
}

function enrichUser(randomUser: Record<string, any>, userIndex: number) {
  const fullName = `${randomUser.name.first} ${randomUser.name.last}`;
  const city = randomUser.location.city;
  const state = randomUser.location.state;
  const country = randomUser.location.country;
  const locationString = `${city}, ${state}, ${country}`;
  const jobTitle = TITLES[userIndex % TITLES.length];
  const departmentName = DEPARTMENTS[userIndex % DEPARTMENTS.length];
  const avatarUrl = randomUser.picture.large;
  const userUuid = randomUser.login.uuid;

  return {
    uuid: userUuid,
    name: fullName,
    title: jobTitle,
    department: departmentName,
    location: locationString,
    avatar: avatarUrl,
    email: randomUser.email,
  };
}

export async function seedEmployeesFromRandomUser(numberOfEmployees = 50) {
  const randomUsers = await fetchRandomUsers(numberOfEmployees);
  const enrichedEmployees = randomUsers.map((randomUser, userIndex) => enrichUser(randomUser, userIndex));
  return enrichedEmployees;
}
