import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

class CardGame {
  n_players: number;
  time_limit: number;
  n_cards: number;
  colors: string[];
  players: Player[];

  constructor(n_players: number, time_limit: number, n_cards: number) {
    this.n_players = n_players;
    this.time_limit = time_limit;
    this.n_cards = n_cards;
    this.colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue'];
    this.players = Array.from({ length: n_players }, (_, i) => new Player(i, this));
  }

  start(): void {
    this.draw_phase();
    // Implement voting_phase if needed
  }

  draw_phase(): void {
    const start_time = Date.now();
    while (Date.now() - start_time < this.time_limit) {
      for (const player of this.players) {
        player.draw_cards();
        if (player.has_max_cards()) {
          break;
        }
      }
    }
  }
}

class Player {
  id: number;
  cards: { [color: string]: number };
  pot_winnings: number;
  game: CardGame;

  constructor(id: number, game: CardGame) {
    this.id = id;
    this.cards = {};
    this.pot_winnings = 0;
    this.game = game;
  }
  
  // Helper method to generate a random integer between min and max (inclusive)
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  has_max_cards(): boolean {
    return this.game.colors.some(color => this.cards[color] === this.game.n_cards);
  }

  draw_cards(): string[] {
    let drawActions: string[] = [];
    const n_cards = this.randomInt(1, this.game.n_cards + 1);
    this.cards = this.game.colors.reduce((acc, color) => {
      const maxVal = Math.max(2, n_cards + 1);
      acc[color] = this.randomInt(1, maxVal);

      // Record the draw action
      drawActions.push(`Player ${this.id} drew ${acc[color]} ${color} cards.`);

      return acc;
    }, {} as { [color: string]: number });

    return drawActions;
  }
}

const TheGame = () => {
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [playerCardDistribution, setPlayerCardDistribution] = useState<Record<number, Record<string, number>>>({}); // Player ID mapped to color and card count
    const [totalsByColor, setTotalsByColor] = useState<Record<string, number>>({}); // Totals for each color
    const [totalCardsPerPlayer, setTotalCardsPerPlayer] = useState<Record<number, number>>({}); // Total cards per player

    useEffect(() => {
        const n_players = 4;
        const time_limit = 10;
        const n_cards = 10;
        const game = new CardGame(n_players, time_limit, n_cards);
        game.start();

        let distribution: Record<number, Record<string, number>> = {};
        game.players.forEach(player => {
            const playerDraws = player.draw_cards();
            distribution[player.id] = playerDraws.reduce((acc, drawAction) => {
                const [_, drawCount, color] = drawAction.match(/drew (\d+) (\w+) cards/)!;
                acc[color] = (acc[color] || 0) + parseInt(drawCount);
                return acc;
            }, {} as Record<string, number>);
        });

        setPlayerCardDistribution(distribution);

        let colorTotals: Record<string, number> = {};
        let playerTotals: Record<number, number> = {};
        game.players.forEach(player => {
            let playerTotal = 0;
            const playerDraws = player.draw_cards();
            distribution[player.id] = playerDraws.reduce((acc, drawAction) => {
                const [_, drawCount, color] = drawAction.match(/drew (\d+) (\w+) cards/)!;
                const count = parseInt(drawCount);
                acc[color] = (acc[color] || 0) + count;

                // Update totals
                playerTotal += count;
                colorTotals[color] = (colorTotals[color] || 0) + count;

                return acc;
            }, {} as Record<string, number>);
            playerTotals[player.id] = playerTotal;
        });

        setPlayerCardDistribution(distribution);
        setTotalsByColor(colorTotals);
        setTotalCardsPerPlayer(playerTotals);

    }, []);

    const colors = ['Red', 'Orange', 'Yellow','Green', 'Blue' ]; // assuming these are the only colors

    // Function to calculate the percentage
    const calculatePercentage = (count: number, total: number) => {
        if (total === 0) return 0;
        return (count / total) * 100;
    };

     // Function to get cell class based on percentage
     const getCellClass = (percentage: number) => {
        return percentage >= 50 ? "bg-deepPink text-notWhite" : "";
    };

    return (
        <div className="container bg-darkPurple mx-auto mt-5">
            <table className="table-auto w-full border-collapse border border-deepPink">
                <thead>
                    <tr>
                        <th className="border border-deepPink px-4 py-2 text-lg text-notWhite">Player/Team</th>
                        {colors.map(color => (
                            <th key={color} className="border border-deepPink px-4 py-2 text-lg text-notWhite">{color}</th>
                        ))}
                        <th className="border border-deepPink px-4 py-2 text-lg text-notWhite">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(playerCardDistribution).map(([playerId, cardCounts]) => (
                        <tr key={playerId}>
                            <td className="border border-deepPink px-4 py-2 text-lg text-notWhite font-bold">Player {playerId}</td>
                            {colors.map(color => {
                                const percentage = calculatePercentage(cardCounts[color] || 0, totalsByColor[color]);
                                return (
                                    <td key={color} className={`border border-deepPink text-lightPurple px-4 py-2 text-md ${getCellClass(percentage)}`}>
                                        {cardCounts[color] || 0} ({percentage.toFixed(2)}%)
                                    </td>
                                );
                            })}
                            <td className="border border-deepPink px-4 py-2 text-md text-notWhite">{totalCardsPerPlayer[Number(playerId)]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TheGame;