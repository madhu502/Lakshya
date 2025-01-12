//import request from supertest
const request = require("supertest");

//importing server file
const app = require("../index");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODc3Nzk1NzJiYmFkNTQxYTAyZjIwNiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyMDE1NDEwMH0.tj6AJOx0tjpmRfibbBFlUA7eT1tFcGYhqRPqZ6iCzuk";

describe("Testing API", () => {
  it("GET /lakshya | Response with text", async () => {
    //send request
    const response = await request(app).get("/lakshya");

    //if its successful, status code
    expect(response.statusCode).toBe(200);

    //compare received text
    expect(response.text).toEqual("Lakshya api is working..");
  });

  //test for add resources

  it("POST /api/resource/add_resource | Response with body", async () => {
    const response = await request(app)
      .post("/api/resource/add_resource")
      .send({
        stream: "MBBS",
        subject: "Zoology",
        image: "frog.png",
      });

    //if condition
    if (!response.body.success) {
      expect(response.body.message).toEqual("Image not found");
    } else {
      expect(response.body.message).toEqual("Resource added successfully");
    }
  });

  // test for fetching resources
  it("GET Resources | Fetch all Resources", async () => {
    const response = await request(app)
      .get("/api/resource/get_all_resource")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("Resource fetched successfully");
  });

  //test for deleting resource

  it("DELETE Resource | Delete a Resource", async () => {
    const resourceId = "66841f09aae6c6e91726278bd";

    const response = await request(app)
      .delete(`/api/resource/delete_resource/${resourceId}`)
      .set("authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(false);
    expect(response.body.message).toEqual("Internal server error");
  });

  it("should fetch a single resource successfully", async () => {
    const response = await request(app)
      .get(`/api/resource/get_single_resource/66841f09aae6c6e91726278bd`)
      .set("authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(false);
    expect(response.body.message).toEqual("Internal server error");
  });

  // test for fetching quizes
  it("GET Quizes | Fetch all Quizes", async () => {
    const response = await request(app)
      .get("/api/quizes/get_all_quizes")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    // expect(response.body.message).toEqual("Quiz created successfully");
  });

  it("should fetch a quiz by its ID", async () => {
    const response = await request(app).get(
      `/api/quizbyid/668412deaae6c6e917262748`
    );

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeDefined();
    expect(response.body.message).toBe("Quiz fetched successfully");
    expect(response.body.quiz).toHaveProperty("_id", quizId.toString());
    expect(response.body.quiz.title).toBe("Sample Quiz");
  });

  it("should return 500 for invalid quiz ID", async () => {
    const invalidQuizId = "123";
    const response = await request(app).get(`/api/quizbyid/${invalidQuizId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeDefined();
    expect(response.body.message).toBe("Quiz not found");
  });

  //test for user registration

  it("POST /api/user/register | Response with body", async () => {
    const response = await request(app).post("/api/user/register").send({
      firstName: "Madhu",
      lastName: "Chaudhary",
      email: "madhu@gmail.com",
      password: "123456",
    });

    //if condition
    if (!response.body.success) {
      expect(response.body.message).toEqual("Please enter all fields !");
    } else {
      expect(response.body.message).toEqual("User created successfully");
    }
  });

  it("POST /api/user/login | Response with Body", async () => {
    const response = await request(app).post("/api/user/login").send({
      email: "madhu@gmail.com",
      password: "123457",
    });

    // Check for  message
    expect(response.body.message).toEqual("Incorrect Passsowrd!");
  });

  //test for creating quiz

  it("POST /api/quizes/createQuiz | Response with body", async () => {
    const response = await request(app).post("/api/quizes/createQuiz").send({
      title: "Chemistry",
      description: "Organic",
      questions: "Molecular formula of water?",
    });

    //if condition
    if (!response.body.success) {
      expect(response.body.message).toEqual("Internal Server Error");
    } else {
      expect(response.body.message).toEqual("Quiz created successfully");
    }
  });
});
