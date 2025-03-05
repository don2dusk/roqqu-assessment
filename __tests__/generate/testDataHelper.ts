import { faker } from "@faker-js/faker";

export function generateTestUser(prefix: string = "user") {
  const generateUsername = (name: string) => {
    const cleanedName = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 15);

    const randomSuffix = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");

    return `${cleanedName}${randomSuffix}`.slice(0, 20);
  };

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const name = `${firstName} ${lastName}`;

  const username = generateUsername(`${prefix}${firstName}${lastName}`);

  return {
    name,
    email: faker.internet.email({
      firstName,
      lastName,
      provider: "example.com",
    }),
    username,
  };
}

export function generateTestUsers(count: number, prefix: string = "user") {
  const users = [];
  const usedUsernames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let user;
    do {
      user = generateTestUser(prefix);
    } while (usedUsernames.has(user.username));

    usedUsernames.add(user.username);
    users.push(user);
  }

  return users;
}
