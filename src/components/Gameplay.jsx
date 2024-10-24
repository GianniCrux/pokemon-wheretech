import { useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import MapGeneration from './MapGeneration';
import GameStateManager from './GameStateManager';

const STORAGE_KEY = 'pokemon-game-state';

const Gameplay = () => {
  const [map, setMap] = useState([]);
  const [gridSize, setGridSize] = useState({ cols: 10, rows: 10 });
  const [characterPosition, setCharacterPosition] = useState(null);
  const [caughtPokemon, setCaughtPokemon] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [wildPokemon, setWildPokemon] = useState(null);
  const [isToastActive, setIsToastActive] = useState(false);

  // Load game state from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setMap(parsedState.map);
        setGridSize({
          cols: parsedState.map.filter(tile => tile.y === 0).length,
          rows: parsedState.map.filter(tile => tile.x === 0).length,
        });
        setCharacterPosition(parsedState.characterPosition);
        setCaughtPokemon(parsedState.caughtPokemon);
        setGameLog(parsedState.gameLog);
      } catch (error) {
        console.error('Error loading saved game state:', error);
      }
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (map.length > 0) {
      const gameState = {
        map,
        characterPosition,
        caughtPokemon,
        gameLog,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [map, characterPosition, caughtPokemon, gameLog]);

  // Fetch Pokémon details including image from PokéAPI
  const fetchPokemonData = async (pokemonName) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      const data = await response.json();
      return data.sprites.front_default; // Get the front image of the Pokémon
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      return null;
    }
  };

  // Generate map and set player position to center
  const handleMapGenerated = (generatedMap) => {
    const cols = generatedMap.filter(tile => tile.y === 0).length;
    const rows = generatedMap.filter(tile => tile.x === 0).length;
    setGridSize({ cols, rows });
    setMap(generatedMap);

    const centerX = Math.floor(rows / 2);
    const centerY = Math.floor(cols / 2);
    setCharacterPosition({ x: centerX, y: centerY });

    // Reset game state when new map is generated
    setCaughtPokemon([]);
    setGameLog([]);
  };

  // Pokémon encounter logic wrapped in useCallback
  const checkPokemonEncounter = useCallback(async () => {
    if (Math.random() < 0.2 && !isToastActive) {
      const possiblePokemon = [
        'Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle',
        'Caterpie', 'Weedle', 'Pidgey', 'Rattata',
      ];
      const pokemon = possiblePokemon[Math.floor(Math.random() * possiblePokemon.length)];

      const image = await fetchPokemonData(pokemon); // Fetch the Pokémon image
      setWildPokemon(pokemon);
      setIsToastActive(true); // Block movement while toast is active

      // Display a styled toast with Pokémon image and options to capture or let go
      toast((t) => (
        <div className="p-2">
          <p className="text-lg">A wild {pokemon} appeared! Do you want to capture it?</p>
          {image && <img src={image} alt={pokemon} className="w-16 h-16 my-2 mx-auto" />}
          <div className="mt-2 flex justify-end space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-1 rounded"
              onClick={() => {
                capturePokemon(pokemon);
                toast.dismiss(t.id);
                setIsToastActive(false); // Allow movement after decision
              }}
            >
              Capture
            </button>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={() => {
                toast.dismiss(t.id);
                setIsToastActive(false); // Allow movement after decision
                setGameLog(prev => [`You let the wild ${pokemon} go.`, ...prev.slice(0, 9)]);
              }}
            >
              Let it go
            </button>
          </div>
        </div>
      ), {
        id: 'pokemon-encounter', // Ensure only one toast
        duration: Infinity, // Wait for user input
      });
    }
  }, [isToastActive]);

  // Capture the Pokémon and update the game state
  const capturePokemon = (pokemon) => {
    setCaughtPokemon(prev => [...prev, pokemon]);
    setGameLog(prev => [`You captured a ${pokemon}!`, ...prev.slice(0, 9)]);
  };

  // Key press movement logic
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!characterPosition || isToastActive) return; // Block movement if toast is active

      // Prevent default arrow key scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      let newX = characterPosition.x;
      let newY = characterPosition.y;

      switch (e.key) {
        case 'ArrowUp':
          newX = Math.max(0, characterPosition.x - 1);
          break;
        case 'ArrowDown':
          newX = Math.min(gridSize.rows - 1, characterPosition.x + 1);
          break;
        case 'ArrowLeft':
          newY = Math.max(0, characterPosition.y - 1);
          break;
        case 'ArrowRight':
          newY = Math.min(gridSize.cols - 1, characterPosition.y + 1);
          break;
        default:
          return;
      }

      const targetTile = map.find(tile => tile.x === newX && tile.y === newY);

      if (targetTile && targetTile.type !== 'water') {
        setCharacterPosition({ x: newX, y: newY });

        if (targetTile.type === 'grass') {
          checkPokemonEncounter(); // Trigger Pokémon encounter on grass
        }
      } else if (targetTile && targetTile.type === 'water') {
        toast.error('You cannot walk on water!', { duration: 2000 });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [characterPosition, gridSize, map, checkPokemonEncounter, isToastActive]);

  const handleLoadState = (importedState) => {
    setMap(importedState.map);
    setGridSize({
      cols: importedState.map.filter(tile => tile.y === 0).length,
      rows: importedState.map.filter(tile => tile.x === 0).length,
    });
    setCharacterPosition(importedState.characterPosition);
    setCaughtPokemon(importedState.caughtPokemon);
    setGameLog(importedState.gameLog);
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Pokemon Adventure</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <MapGeneration onMapGenerated={handleMapGenerated} />
          <GameStateManager
            gameState={{ map, characterPosition, caughtPokemon, gameLog }}
            onLoadState={handleLoadState}
          />
        </div>
        <div className="lg:w-2/3">
          {map.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Adventure Map</h2>
              <div className="relative overflow-auto">
                <div
                  className="map-container inline-grid gap-px p-px bg-gray-300"
                  style={{
                    gridTemplateColumns: `repeat(${gridSize.cols}, 24px)`,
                    gridTemplateRows: `repeat(${gridSize.rows}, 24px)`,
                  }}
                >
                  {map.map((tile) => (
                    <div
                      key={tile.id}
                      className="w-6 h-6 relative"
                      style={{
                        backgroundColor:
                          tile.type === 'water' ? '#4a90e2' :
                          tile.type === 'grass' ? '#68c151' :
                          '#d4b483',
                      }}
                    >
                      {characterPosition?.x === tile.x && characterPosition?.y === tile.y && (
                        <div
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full z-10 border-2 border-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Caught Pokemon ({caughtPokemon.length})</h3>
          <ul className="max-h-40 overflow-y-auto">
            {caughtPokemon.map((pokemon, index) => (
              <li key={index} className="py-1 text-gray-700">{pokemon}</li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/2 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Game Log</h3>
          <ul className="max-h-40 overflow-y-auto">
            {gameLog.map((log, index) => (
              <li key={index} className="py-1 text-sm text-gray-600">{log}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Gameplay;
