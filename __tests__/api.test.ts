import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/db";
import { generateTestUser, generateTestUsers } from "./generate/testDataHelper";

describe("API Integration Tests", () => {
  let existingUserId: string;
  let existingPostId: string;

  beforeAll(async () => {
    const existingUser = await prisma.user.findFirst();
    if (!existingUser) {
      const testUser = generateTestUser("initial");
      const newUser = await prisma.user.create({
        data: testUser,
      });
      existingUserId = newUser.id;
    } else {
      existingUserId = existingUser.id;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("User Endpoints", () => {
    test("Create New User", async () => {
      const testUser = generateTestUser();
      const response = await request(app)
        .post("/api/v1/users/add")
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("email");
    });

    test("Create Multiple Dummy Users", async () => {
      const users = generateTestUsers(15);

      const responses = await Promise.all(
        users.map((user) =>
          request(app).post("/api/v1/users/add").send(user).expect(201)
        )
      );

      responses.forEach((response) => {
        expect(response.body).toHaveProperty("user");
        expect(response.body.user).toHaveProperty("id");
      });
    });

    test("Get Paginated Users", async () => {
      const response = await request(app)
        .get("/api/v1/users")
        .query({ pageNumber: 1, pageSize: 10 })
        .expect(200);

      expect(response.body).toHaveProperty("data.users");
      expect(Array.isArray(response.body.data.users)).toBe(true);
      expect(response.body.data.users.length).toBeGreaterThan(0);
    });

    test("Get Specific User Details", async () => {
      const response = await request(app)
        .get(`/api/v1/users/${existingUserId}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "User fetched successfully"
      );
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.id).toBe(existingUserId);
    });

    describe("Address Endpoints", () => {
      test("Get User Address", async () => {
        try {
          const response = await request(app)
            .get(`/api/v1/addresses/${existingUserId}`)
            .expect((res) => {
              if (res.status === 200) {
                expect(res.body.user).toHaveProperty("address");
                expect(res.body.success).toBe(true);
              } else if (res.status === 404) {
                const expectedMessages = [
                  "No address found for this user",
                  "No address found for user",
                ];

                expect(expectedMessages).toContain(res.body.message);
              } else {
                throw new Error(`Unexpected status code: ${res.status}`);
              }
            });
        } catch (error) {
          console.error("Address retrieval test failed:", error);
          throw error;
        }
      });

      test("Create User Address", async () => {
        const address: string = "Ikota Villa Estate, Lekki";
        const response = await request(app)
          .post("/api/v1/addresses")
          .send({
            userID: existingUserId,
            address: address,
          })
          .expect(200);

        expect(response.body.user.address).toBe(address);
        expect(response.body.user.id).toBe(existingUserId);
      });

      test("Update User Address", async () => {
        const address: string = "Lekki Phase 1, Lagos";
        const response = await request(app)
          .patch(`/api/v1/addresses/${existingUserId}`)
          .send({
            address: address,
          })
          .expect(200);

        expect(response.body.user.address).toBe(address);
        expect(response.body.user.id).toBe(existingUserId);
        expect(response.body.success).toBe(true);
      });
    });
  });

  describe("Post Endpoints", () => {
    test("Create New Post", async () => {
      const response = await request(app)
        .post("/api/v1/posts")
        .send({
          title: `Test Post for User ${existingUserId}`,
          body: "This is a test post.",
          userId: existingUserId,
        })
        .expect(201);

      expect(response.body.message).toBe("Post created successfully");
      expect(response.body.success).toBe(true);
      existingPostId = response.body.post.id;
    });

    test("Get Posts for User", async () => {
      const response = await request(app)
        .get(`/api/v1/posts`)
        .query({ userId: existingUserId })
        .expect(200);

      expect(response.body).toHaveProperty("posts");
      expect(Array.isArray(response.body.posts)).toBe(true);
      expect(response.body.success).toBe(true);

      if (response.body.posts.length > 0) {
        const userPosts = response.body.posts.filter(
          (post: any) => post.userId === existingUserId
        );
        expect(userPosts.length).toBeGreaterThan(0);
      }
    });

    test("Delete Post", async () => {
      const response = await request(app)
        .delete(`/api/v1/posts/${existingPostId}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message");
    });
  });
});
