import { games } from "./games.js";

const gameSelect = document.querySelector("#game-select");
const form = document.querySelector("#chat-form");
const questionInput = document.querySelector("#question");
const feedback = document.querySelector("#form-feedback");
const chatLog = document.querySelector("#chat-log");
const suggestionButtons = document.querySelectorAll(".suggestion");


/*
  Fill the dropdown automatically from games.js.
  If a teammate adds another game to games.js later,
  it will automatically appear here.
*/
for (const game of games) {
  const option = document.createElement("option");

  option.value = game.id;
  option.textContent = game.title;

  gameSelect.append(option);
}


/*
  When the user selects a game,
  tell them the assistant is ready.
*/
gameSelect.addEventListener("change", () => {
  feedback.textContent = "";

  const game = getSelectedGame();

  if (!game) {
    return;
  }

  addMessage(
    "assistant",
    `You selected ${game.title}. Ask me about its goal, controls, rules, scoring, or how to play.`
  );

  questionInput.focus();
});


/*
  Handle questions typed into the input box.
*/
form.addEventListener("submit", (event) => {
  event.preventDefault();

  askQuestion(questionInput.value);
});


/*
  Handle the suggested-question buttons.
*/
for (const button of suggestionButtons) {
  button.addEventListener("click", () => {
    askQuestion(button.dataset.question);
  });
}


/*
  Process a user's question.
*/
function askQuestion(rawQuestion) {
  const question = rawQuestion.trim();
  const game = getSelectedGame();

  feedback.textContent = "";


  // Requirement: user must select a game.
  if (!game) {
    feedback.textContent =
      "Choose a game before asking a question.";

    gameSelect.focus();

    return;
  }


  // Requirement: handle empty chatbot input.
  if (!question) {
    feedback.textContent =
      "Type a question or choose one of the suggested questions.";

    questionInput.focus();

    return;
  }


  addMessage("user", question);

  const answer = answerQuestion(game, question);

  addMessage("assistant", answer);

  questionInput.value = "";
  questionInput.focus();
}


/*
  Find the selected game inside games.js.
*/
function getSelectedGame() {
  return games.find(
    (game) => game.id === gameSelect.value
  );
}


/*
  Answer questions using ONLY information
  stored in the selected game's data.
*/
function answerQuestion(game, question) {
  const q = question.toLowerCase();


  // HOW TO PLAY / GENERAL INSTRUCTIONS
  if (
    containsAny(q, [
      "how to play",
      "how do i play",
      "instructions",
      "how does this game work"
    ])
  ) {
    const information = [];

    if (hasDocumentation(game.goal)) {
      information.push(`Goal: ${game.goal}`);
    }

    if (hasDocumentation(game.controls)) {
      information.push(`Controls: ${game.controls}`);
    }

    if (hasDocumentation(game.rules)) {
      information.push(`Rules: ${game.rules}`);
    }


    if (information.length > 0) {
      return information.join(" ");
    }

    return missingDocumentation(
      game,
      "instructions"
    );
  }


  // GOAL / WINNING
  if (
    containsAny(q, [
      "goal",
      "objective",
      "win",
      "winning",
      "how do i win",
      "how to win"
    ])
  ) {
    if (hasDocumentation(game.goal)) {
      return game.goal;
    }

    return missingDocumentation(
      game,
      "goal or win condition"
    );
  }


  // CONTROLS
  if (
    containsAny(q, [
      "control",
      "move",
      "movement",
      "keyboard",
      "key",
      "mouse",
      "click",
      "button"
    ])
  ) {
    if (hasDocumentation(game.controls)) {
      return game.controls;
    }

    return missingDocumentation(
      game,
      "controls"
    );
  }


  // RULES / LOSING
  if (
    containsAny(q, [
      "rule",
      "rules",
      "lose",
      "loss",
      "game over",
      "allowed",
      "not allowed"
    ])
  ) {
    if (hasDocumentation(game.rules)) {
      return game.rules;
    }

    return missingDocumentation(
      game,
      "rules"
    );
  }


  // SCORING
  if (
    containsAny(q, [
      "score",
      "scoring",
      "point",
      "points",
      "high score",
      "best score"
    ])
  ) {

    /*
      If the team later adds:
      scoring: "..."
      to games.js, the chatbot automatically uses it.
    */
    if (hasDocumentation(game.scoring)) {
      return game.scoring;
    }


    return missingDocumentation(
      game,
      "scoring information"
    );
  }


  /*
    No supported documented topic matched.
    Do not invent an answer.
  */
  return (
    `I don't have a documented answer for that ${game.title} question yet. ` +
    "Try asking about the goal, controls, rules, scoring, or how to play."
  );
}


/*
  Check whether something contains real documentation
  instead of an empty value or [Placeholder].
*/
function hasDocumentation(text) {
  return (
    typeof text === "string" &&
    text.trim() !== "" &&
    !text.toLowerCase().includes("[placeholder]")
  );
}


/*
  Clear response when documentation don't exist yet.
*/
function missingDocumentation(game, topic) {
  return (
    `${game.title}'s ${topic} has not been documented yet. ` +
    "When the team updates the game documentation, " +
    "this assistant will use the new information automatically."
  );
}


/*
  Helper for recognizing question types.
*/
function containsAny(text, terms) {
  return terms.some(
    (term) => text.includes(term)
  );
}


/*
  for Add a message to visible chat.
*/
function addMessage(role, text) {
  const message = document.createElement("div");

  message.className =
    role === "user"
      ? "message user-message"
      : "message assistant-message";


  const label = document.createElement("strong");

  label.textContent =
    role === "user"
      ? "You"
      : "Game Help";

  const paragraph = document.createElement("p");

  paragraph.textContent = text;


  message.append(
    label,
    paragraph
  );


  chatLog.append(message);


  chatLog.scrollTop =
    chatLog.scrollHeight;
}
