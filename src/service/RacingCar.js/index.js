import { console, readLine, shouldCarRun } from "../../utils";
import { MESSAGES } from "../../constants";
import { CustomError } from "../../exceptions";

import { Cars } from "../../domain";

const CAR_NAME_LENGTH_LIMIT = 5;

export class RacingCarGame {
  #cars;
  #totalRounds;
  #currentRound = 0;

  static createGame() {
    return new RacingCarGame();
  }

  async promptCarNames() {
    const carNamesInput = await readLine(MESSAGES.PLACEHOLDER.CAR.NAME);
    const carNames = carNamesInput.split(",");

    carNames.forEach((carName) => {
      this.#validateCarNames(carName);
    });

    this.#setCars(carNames);
  }

  async promptTotalRounds() {
    const totalRoundsInput = +(await readLine(MESSAGES.PLACEHOLDER.ROUND));

    this.#validateTotalRounds(totalRoundsInput);

    this.#totalRounds = totalRoundsInput;
  }

  play() {
    console(MESSAGES.RESULT);
    while (this.#currentRound < this.#totalRounds) {
      this.#cars.getCars().forEach((car) => {
        if (shouldCarRun()) car.run();
      });

      console(this.#getRoundResult());

      this.#currentRound += 1;
    }
  }

  displayWinners() {
    const winners = this.#getWinners();
    const winnerNames = winners.map((winner) => winner.name).join(", ");

    console(MESSAGES.WINNER(winnerNames));
  }

  #setCars(carNames) {
    this.#cars = new Cars(carNames);
  }

  #validateCarNames(carName) {
    if (carName === "") throw new CustomError(MESSAGES.ERROR.CAR.NAME.EMPTY);

    if (carName.length > CAR_NAME_LENGTH_LIMIT)
      throw new CustomError(
        MESSAGES.ERROR.CAR.NAME.LENGTH(CAR_NAME_LENGTH_LIMIT)
      );
  }

  #validateTotalRounds(totalRounds) {
    if (totalRounds === "")
      throw new CustomError(MESSAGES.ERROR.TOTAL_ROUNDS.EMPTY);

    if (isNaN(totalRounds))
      throw new CustomError(MESSAGES.ERROR.TOTAL_ROUNDS.TYPE);

    if (totalRounds <= 0)
      throw new CustomError(MESSAGES.ERROR.TOTAL_ROUNDS.LENGTH);

    if (!Number.isInteger(totalRounds))
      throw new CustomError(MESSAGES.ERROR.TOTAL_ROUNDS.NOT_INTEGER);
  }

  #getRoundResult() {
    const carNames = this.#cars.getCarNames();
    const roundResult = this.#cars.getCarOffsets().map((offset) => {
      return "-".repeat(offset);
    });

    let result = "";

    carNames.forEach((carName, index) => {
      result += `${carName} : ${roundResult[index]}\n`;
    });

    return result;
  }

  #getWinners() {
    const maxOffset = Math.max(...this.#cars.getCarOffsets());
    const winners = this.#cars.getCars().filter((car) => {
      return car.horizontalOffset === maxOffset;
    });

    return winners;
  }
}
