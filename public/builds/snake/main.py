import asyncio
import random
import pygame

pygame.init()

# --------------------------------------------------
# WINDOW / GAME SETTINGS
# --------------------------------------------------

WIDTH = 600
HEIGHT = 600
HUD_HEIGHT = 60
CELL_SIZE = 20

BASE_SPEED = 10
MAX_SPEED = 18
SPEED_INCREASE_SCORE = 5

COUNTDOWN_TIME = 700

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Snake")

clock = pygame.time.Clock()


# --------------------------------------------------
# FONTS
# --------------------------------------------------

title_font = pygame.font.Font(None, 80)
countdown_font = pygame.font.Font(None, 120)
font = pygame.font.Font(None, 36)
small_font = pygame.font.Font(None, 26)


# --------------------------------------------------
# COLORS
# --------------------------------------------------

BACKGROUND = (20, 20, 20)
HUD_COLOR = (28, 28, 28)
BORDER_COLOR = (65, 65, 65)
GRID_COLOR = (38, 38, 38)

SNAKE_COLOR = (0, 81, 186)
SNAKE_ALT_COLOR = (232, 0, 13)
HEAD_COLOR = (88, 172, 250)

FOOD_COLOR = (255, 200, 0)

TEXT_COLOR = (240, 240, 240)
MUTED_TEXT = (170, 170, 170)

BUTTON_COLOR = (0, 81, 186)
BUTTON_HOVER = (40, 120, 210)
BUTTON_TEXT = (240, 240, 240)


# --------------------------------------------------
# BUTTONS
# --------------------------------------------------

play_button = pygame.Rect(
    WIDTH // 2 - 100,
    HEIGHT // 2 + 40,
    200,
    60
)


# --------------------------------------------------
# GAME STATE HELPERS
# --------------------------------------------------

def random_food(snake):
    """Choose a playable grid position not occupied by the snake."""

    while True:
        x = random.randrange(0, WIDTH, CELL_SIZE)
        y = random.randrange(HUD_HEIGHT, HEIGHT, CELL_SIZE)

        if (x, y) not in snake:
            return (x, y)


def reset_game():
    """Create the starting game state."""

    snake = [
        (300, 300),
        (280, 300),
        (260, 300)
    ]

    direction = (CELL_SIZE, 0)
    food = random_food(snake)
    score = 0

    return snake, direction, food, score


def get_speed(score):
    """Increase movement speed every five points."""

    speed_increase = score // SPEED_INCREASE_SCORE

    return min(
        BASE_SPEED + speed_increase,
        MAX_SPEED
    )


# --------------------------------------------------
# DRAWING
# --------------------------------------------------

def draw_grid():
    """Draw the grid over the playable area."""

    for x in range(0, WIDTH, CELL_SIZE):
        pygame.draw.line(
            screen,
            GRID_COLOR,
            (x, HUD_HEIGHT),
            (x, HEIGHT)
        )

    for y in range(HUD_HEIGHT, HEIGHT, CELL_SIZE):
        pygame.draw.line(
            screen,
            GRID_COLOR,
            (0, y),
            (WIDTH, y)
        )


def draw_menu(best_score):
    screen.fill(BACKGROUND)

    title = title_font.render(
        "SNAKE",
        True,
        SNAKE_COLOR
    )

    screen.blit(
        title,
        title.get_rect(
            center=(
                WIDTH // 2,
                HEIGHT // 2 - 120
            )
        )
    )

    subtitle = small_font.render(
        "Arrow Keys / WASD to move",
        True,
        MUTED_TEXT
    )

    screen.blit(
        subtitle,
        subtitle.get_rect(
            center=(
                WIDTH // 2,
                HEIGHT // 2 - 55
            )
        )
    )

    best_text = font.render(
        f"Best Score: {best_score}",
        True,
        TEXT_COLOR
    )

    screen.blit(
        best_text,
        best_text.get_rect(
            center=(
                WIDTH // 2,
                HEIGHT // 2 - 10
            )
        )
    )

    mouse_pos = pygame.mouse.get_pos()

    if play_button.collidepoint(mouse_pos):
        button_color = BUTTON_HOVER
    else:
        button_color = BUTTON_COLOR

    pygame.draw.rect(
        screen,
        button_color,
        play_button,
        border_radius=8
    )

    play_text = font.render(
        "PLAY",
        True,
        BUTTON_TEXT
    )

    screen.blit(
        play_text,
        play_text.get_rect(
            center=play_button.center
        )
    )

    enter_text = small_font.render(
        "or press Enter / Space",
        True,
        MUTED_TEXT
    )

    screen.blit(
        enter_text,
        enter_text.get_rect(
            center=(
                WIDTH // 2,
                HEIGHT // 2 + 135
            )
        )
    )

    pygame.display.update()


def draw_board(
    snake,
    food,
    score,
    best_score
):
    screen.fill(BACKGROUND)

    draw_grid()

    # HUD
    pygame.draw.rect(
        screen,
        HUD_COLOR,
        (
            0,
            0,
            WIDTH,
            HUD_HEIGHT
        )
    )

    pygame.draw.line(
        screen,
        BORDER_COLOR,
        (0, HUD_HEIGHT),
        (WIDTH, HUD_HEIGHT),
        2
    )

    score_text = font.render(
        f"Score: {score}",
        True,
        TEXT_COLOR
    )

    best_text = font.render(
        f"Best: {best_score}",
        True,
        TEXT_COLOR
    )

    screen.blit(
        score_text,
        (15, 15)
    )

    screen.blit(
        best_text,
        best_text.get_rect(
            midright=(
                WIDTH - 15,
                HUD_HEIGHT // 2
            )
        )
    )

    # Food
    pygame.draw.rect(
        screen,
        FOOD_COLOR,
        (
            food[0],
            food[1],
            CELL_SIZE,
            CELL_SIZE
        ),
        border_radius=4
    )

    # Snake
    for index, segment in enumerate(snake):

        if index == 0:
            color = HEAD_COLOR

        elif index % 2 == 0:
            color = SNAKE_COLOR

        else:
            color = SNAKE_ALT_COLOR

        pygame.draw.rect(
            screen,
            color,
            (
                segment[0],
                segment[1],
                CELL_SIZE,
                CELL_SIZE
            ),
            border_radius=3
        )


def draw_game(
    snake,
    food,
    score,
    best_score
):
    draw_board(
        snake,
        food,
        score,
        best_score
    )

    pause_text = small_font.render(
        "P = Pause",
        True,
        MUTED_TEXT
    )

    screen.blit(
        pause_text,
        pause_text.get_rect(
            midbottom=(
                WIDTH // 2,
                HUD_HEIGHT - 8
            )
        )
    )

    pygame.display.update()


def draw_pause(
    snake,
    food,
    score,
    best_score
):
    draw_board(
        snake,
        food,
        score,
        best_score
    )

    overlay = pygame.Surface(
        (WIDTH, HEIGHT),
        pygame.SRCALPHA
    )

    overlay.fill((0, 0, 0, 150))

    screen.blit(
        overlay,
        (0, 0)
    )

    pause_text = title_font.render(
        "PAUSED",
        True,
        TEXT_COLOR
    )

    resume_text = font.render(
        "Press P to resume",
        True,
        TEXT_COLOR
    )

    screen.blit(
        pause_text,
        pause_text.get_rect(
            center=(
                WIDTH // 2,
                HEIGHT // 2 - 30
            )
        )
    )

    screen.blit(
        resume_text,
        resume_text.get_rect(
            center=(
                WIDTH // 2,
                HEIGHT // 2 + 40
            )
        )
    )

    pygame.display.update()


def draw_countdown(
    snake,
    food,
    score,
    best_score,
    countdown_value
):
    draw_board(
        snake,
        food,
        score,
        best_score
    )

    overlay = pygame.Surface(
        (
            WIDTH,
            HEIGHT - HUD_HEIGHT
        ),
        pygame.SRCALPHA
    )

    overlay.fill((0, 0, 0, 110))

    screen.blit(
        overlay,
        (0, HUD_HEIGHT)
    )

    countdown_text = countdown_font.render(
        countdown_value,
        True,
        TEXT_COLOR
    )

    screen.blit(
        countdown_text,
        countdown_text.get_rect(
            center=(
                WIDTH // 2,
                (HEIGHT + HUD_HEIGHT) // 2
            )
        )
    )

    pygame.display.update()


def draw_game_over(
    score,
    best_score,
    new_best
):
    screen.fill(BACKGROUND)

    game_over_text = title_font.render(
        "GAME OVER",
        True,
        SNAKE_ALT_COLOR
    )

    score_text = font.render(
        f"Score: {score}",
        True,
        TEXT_COLOR
    )

    best_text = font.render(
        f"Best Score: {best_score}",
        True,
        TEXT_COLOR
    )

    screen.blit(
        game_over_text,
        game_over_text.get_rect(
            center=(
                WIDTH // 2,
                HEIGHT // 2 - 135
            )
        )
    )

    screen.blit(
        score_text,
        score_text.get_rect(
            center=(
                WIDTH // 2,
                HEIGHT // 2 - 50
            )
        )
    )

    screen.blit(
        best_text,
        best_text.get_rect(
            center=(
                WIDTH // 2,
                HEIGHT // 2 - 10
            )
        )
    )

    if new_best:
        new_best_text = font.render(
            "NEW BEST!",
            True,
            FOOD_COLOR
        )

        screen.blit(
            new_best_text,
            new_best_text.get_rect(
                center=(
                    WIDTH // 2,
                    HEIGHT // 2 + 35
                )
            )
        )

    restart_text = font.render(
        "Press R to restart",
        True,
        TEXT_COLOR
    )

    screen.blit(
        restart_text,
        restart_text.get_rect(
            center=(
                WIDTH // 2,
                HEIGHT // 2 + 100
            )
        )
    )

    menu_text = small_font.render(
        "Press M for menu",
        True,
        MUTED_TEXT
    )

    screen.blit(
        menu_text,
        menu_text.get_rect(
            center=(
                WIDTH // 2,
                HEIGHT // 2 + 145
            )
        )
    )

    pygame.display.update()


# --------------------------------------------------
# MAIN GAME LOOP
# --------------------------------------------------

async def main():

    snake, direction, food, score = reset_game()

    best_score = 0
    new_best = False

    state = "menu"

    countdown_start = 0

    running = True

    while running:

        # ------------------------------------------
        # INPUT
        # ------------------------------------------

        for event in pygame.event.get():

            if event.type == pygame.QUIT:
                running = False

            # MENU
            if state == "menu":

                if event.type == pygame.KEYDOWN:

                    if event.key in (
                        pygame.K_RETURN,
                        pygame.K_SPACE
                    ):
                        snake, direction, food, score = reset_game()

                        new_best = False

                        state = "countdown"
                        countdown_start = pygame.time.get_ticks()

                elif event.type == pygame.MOUSEBUTTONDOWN:

                    if (
                        event.button == 1
                        and play_button.collidepoint(event.pos)
                    ):
                        snake, direction, food, score = reset_game()

                        new_best = False

                        state = "countdown"
                        countdown_start = pygame.time.get_ticks()

            # PLAYING
            elif state == "playing":

                if event.type == pygame.KEYDOWN:

                    if event.key == pygame.K_p:

                        state = "paused"

                    elif event.key in (
                        pygame.K_UP,
                        pygame.K_w
                    ):

                        if direction != (
                            0,
                            CELL_SIZE
                        ):
                            direction = (
                                0,
                                -CELL_SIZE
                            )

                    elif event.key in (
                        pygame.K_DOWN,
                        pygame.K_s
                    ):

                        if direction != (
                            0,
                            -CELL_SIZE
                        ):
                            direction = (
                                0,
                                CELL_SIZE
                            )

                    elif event.key in (
                        pygame.K_LEFT,
                        pygame.K_a
                    ):

                        if direction != (
                            CELL_SIZE,
                            0
                        ):
                            direction = (
                                -CELL_SIZE,
                                0
                            )

                    elif event.key in (
                        pygame.K_RIGHT,
                        pygame.K_d
                    ):

                        if direction != (
                            -CELL_SIZE,
                            0
                        ):
                            direction = (
                                CELL_SIZE,
                                0
                            )

            # PAUSED
            elif state == "paused":

                if event.type == pygame.KEYDOWN:

                    if event.key == pygame.K_p:
                        state = "countdown"
                        countdown_start = pygame.time.get_ticks()

            # GAME OVER
            elif state == "game_over":

                if event.type == pygame.KEYDOWN:

                    if event.key == pygame.K_r:

                        snake, direction, food, score = reset_game()

                        new_best = False

                        state = "countdown"
                        countdown_start = pygame.time.get_ticks()

                    elif event.key == pygame.K_m:

                        state = "menu"

        # ------------------------------------------
        # COUNTDOWN
        # ------------------------------------------

        if state == "countdown":

            elapsed = (
                pygame.time.get_ticks()
                - countdown_start
            )

            stage = elapsed // COUNTDOWN_TIME

            if stage == 0:
                countdown_value = "3"

            elif stage == 1:
                countdown_value = "2"

            elif stage == 2:
                countdown_value = "1"

            elif stage == 3:
                countdown_value = "GO!"

            else:
                state = "playing"
                countdown_value = ""

        # ------------------------------------------
        # UPDATE GAME
        # ------------------------------------------

        if state == "playing":

            head_x, head_y = snake[0]

            new_head = (
                head_x + direction[0],
                head_y + direction[1]
            )

            eating = new_head == food

            # The tail moves away if food was not eaten,
            # so that final square should not count
            # toward self collision.
            body_to_check = (
                snake
                if eating
                else snake[:-1]
            )

            hit_wall = (
                new_head[0] < 0
                or new_head[0] >= WIDTH
                or new_head[1] < HUD_HEIGHT
                or new_head[1] >= HEIGHT
            )

            hit_self = (
                new_head in body_to_check
            )

            if hit_wall or hit_self:

                if score > best_score:
                    best_score = score
                    new_best = score > 0
                else:
                    new_best = False

                state = "game_over"

            else:

                snake.insert(
                    0,
                    new_head
                )

                if eating:

                    score += 1
                    food = random_food(snake)

                else:

                    snake.pop()

        # ------------------------------------------
        # DRAW
        # ------------------------------------------

        if state == "menu":

            draw_menu(best_score)

        elif state == "countdown":

            draw_countdown(
                snake,
                food,
                score,
                best_score,
                countdown_value
            )

        elif state == "playing":

            draw_game(
                snake,
                food,
                score,
                best_score
            )

        elif state == "paused":

            draw_pause(
                snake,
                food,
                score,
                best_score
            )

        elif state == "game_over":

            draw_game_over(
                score,
                best_score,
                new_best
            )

        # ------------------------------------------
        # SPEED
        # ------------------------------------------

        if state == "playing":

            current_speed = get_speed(score)

            clock.tick(current_speed)

        else:

            clock.tick(60)

        # Required for Pygbag/browser compatibility
        await asyncio.sleep(0)

    pygame.quit()


asyncio.run(main())