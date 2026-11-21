import { games } from "./games.js";

const gameList = document.querySelector("#game-list");
const gameTitle = document.querySelector("#game-title");

if (gameList) {
  for (const game of games) {
    const card = document.createElement("article");
    card.className = "panel game-card";

    const title = document.createElement("h2");
    title.textContent = game.title;
    const description = document.createElement("p");
    description.textContent = game.description;
    const link = document.createElement("a");
    link.className = "button secondary";
    link.href = `/game.html?id=${encodeURIComponent(game.id)}`;
    link.textContent = "View game →";
    link.setAttribute("aria-label", `View ${game.title}`);

    card.append(title, description, link);
    gameList.append(card);
  }
}

if (gameTitle) {
  const id = new URLSearchParams(location.search).get("id");
  const game = games.find((entry) => entry.id === id);
  if (game) {
    await showGame(game);
  } else {
    gameTitle.textContent = "Game not found";
    document.querySelector("#game-description").textContent = "Choose a game from the catalog.";
    document.title = "Game not found | Our Game Arcade";
  }
}

async function showGame(game) {
  gameTitle.textContent = game.title;
  document.title = `${game.title} | Our Game Arcade`;
  document.querySelector("#game-description").textContent = game.description;

  const instructions = document.querySelector("#game-instructions");
  for (const [label, text] of [["Goal", game.goal], ["Controls", game.controls], ["Rules", game.rules]]) {
    const term = document.createElement("dt");
    term.textContent = label;
    const definition = document.createElement("dd");
    definition.textContent = text;
    instructions.append(term, definition);
  }
  document.querySelector("#instructions").hidden = false;

  const buildUrl = `/builds/${encodeURIComponent(game.id)}/index.html`;
  const status = document.querySelector("#game-status");
  document.querySelector("#play-area").hidden = false;

  try {
    const response = await fetch(buildUrl, { method: "HEAD" });
    if (response.status === 404) {
      status.textContent = "The browser build for this game has not been added yet.";
      return;
    }
    if (!response.ok) {
      throw new Error(`Build returned HTTP ${response.status}`);
    }
  } catch {
    status.textContent = "The browser build could not be reached. Reload this page to try again.";
    return;
  }

  status.hidden = true;
  document.querySelector("#open-build").href = buildUrl;
  document.querySelector("#play-actions").hidden = false;
  const launch = document.querySelector("#launch-game");
  launch.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.title = `Play ${game.title}`;
    frame.src = buildUrl;
    frame.allowFullscreen = true;
    document.querySelector("#game-frame").replaceChildren(frame);
    launch.textContent = "Reload game";
  });
}
