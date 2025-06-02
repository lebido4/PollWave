describe("Polls", () => {
  beforeEach(() => {
    cy.login("test@example.com", "password123");
  });

  it("should create a new poll", () => {
    const pollData = {
      title: "Favorite Programming Language",
      description: "What is your favorite programming language?",
      options: ["JavaScript", "Python", "Java", "C++"],
    };

    cy.createPoll(pollData.title, pollData.description, pollData.options);
    cy.url().should("include", "/dashboard");
    cy.contains(pollData.title).should("be.visible");
  });

  it("should vote on a poll", () => {
    cy.visit("/polls");
    cy.contains("Лучший язык программирования?").click();
    cy.contains("Проголосуй").click();
    cy.contains("JavaScript").click();
    cy.contains("Отправить голос").click();
    cy.url().should("include", "/results");
    cy.contains("JavaScript").should("be.visible");
  });

  it("should filter polls", () => {
    cy.visit("/polls");
    cy.get('input[placeholder="Search polls..."]').type("Programming");
    cy.contains("Favorite Programming Language").should("be.visible");
    cy.get("select").first().select("active");
    cy.contains("Favorite Programming Language").should("be.visible");
  });

  it("should delete a poll", () => {
    cy.visit("/dashboard");
    cy.contains(".pollCard", "Favorite Programming Language")
      .find('button[title="Delete poll"]')
      .click();
    cy.on("window:confirm", () => true);
    cy.contains("Favorite Programming Language").should("not.exist");
  });
});
