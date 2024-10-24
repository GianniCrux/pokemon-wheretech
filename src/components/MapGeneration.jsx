import { useState } from 'react';
import PropTypes from 'prop-types';

const MapGeneration = ({ onMapGenerated }) => {
  const [mapSize, setMapSize] = useState('small');
  const [terrainDistribution, setTerrainDistribution] = useState({
    water: 10,
    grass: 20,
    land: 70,
  });

  const getSize = (size) => {
    switch (size) {
      case 'small':
        return { rows: 10, cols: 10 };
      case 'medium':
        return { rows: 25, cols: 20 };
      case 'large':
        return { rows: 40, cols: 25 };
      default:
        return { rows: 10, cols: 10 };
    }
  };

  const getNeighbors = (x, y, rows, cols) => {
    const neighbors = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
        neighbors.push([newX, newY]);
      }
    }
    return neighbors;
  };

  const createContiguousRegion = (mapArray, type, startX, startY, remainingTiles) => {
    if (remainingTiles <= 0 || mapArray[startX][startY] !== 'land') {
      return 0;
    }

    const rows = mapArray.length;
    const cols = mapArray[0].length;
    let tilesPlaced = 0;
    const queue = [[startX, startY]];
    
    while (queue.length > 0 && tilesPlaced < remainingTiles) {
      const [x, y] = queue.shift();
      
      if (mapArray[x][y] === 'land') {
        mapArray[x][y] = type;
        tilesPlaced++;
        
        const neighbors = getNeighbors(x, y, rows, cols);
        for (let i = neighbors.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
        }
        
        queue.push(...neighbors);
      }
    }
    
    return tilesPlaced;
  };

  const createContiguousMap = (size, distribution) => {
    const { water, grass } = distribution;
    const totalTiles = size.rows * size.cols;
    const waterTiles = Math.floor((water / 100) * totalTiles);
    const grassTiles = Math.floor((grass / 100) * totalTiles);

    let mapArray = Array(size.rows).fill().map(() => Array(size.cols).fill('land'));

    let remainingWater = waterTiles;
    while (remainingWater > 0) {
      const startX = Math.floor(Math.random() * size.rows);
      const startY = Math.floor(Math.random() * size.cols);
      const placed = createContiguousRegion(mapArray, 'water', startX, startY, remainingWater);
      remainingWater -= placed;
    }

    let remainingGrass = grassTiles;
    while (remainingGrass > 0) {
      const startX = Math.floor(Math.random() * size.rows);
      const startY = Math.floor(Math.random() * size.cols);
      const placed = createContiguousRegion(mapArray, 'grass', startX, startY, remainingGrass);
      remainingGrass -= placed;
    }

    const flatMap = [];
    mapArray.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        flatMap.push({
          id: `${rowIndex}-${colIndex}`,
          type: tile,
          x: rowIndex,
          y: colIndex
        });
      });
    });

    return flatMap;
  };

  const generateMap = () => {
    const size = getSize(mapSize);
    const generatedMap = createContiguousMap(size, terrainDistribution);
    onMapGenerated(generatedMap);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Map Generation</h2>
      <div className="space-y-6">
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Map Size:</label>
          <select 
            value={mapSize} 
            onChange={(e) => setMapSize(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="small">Small (10x10)</option>
            <option value="medium">Medium (25x20)</option>
            <option value="large">Large (40x25)</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Water Percentage:</label>
          <input
            type="number"
            value={terrainDistribution.water}
            onChange={(e) => {
              const value = Math.min(30, Math.max(10, Number(e.target.value)));
              setTerrainDistribution(prev => ({
                ...prev,
                water: value,
                land: 100 - value - prev.grass
              }));
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="10"
            max="30"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Grass Percentage:</label>
          <input
            type="number"
            value={terrainDistribution.grass}
            onChange={(e) => {
              const value = Math.min(30, Math.max(10, Number(e.target.value)));
              setTerrainDistribution(prev => ({
                ...prev,
                grass: value,
                land: 100 - prev.water - value
              }));
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="10"
            max="30"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Land Percentage (calculated):</label>
          <input
            type="number"
            value={terrainDistribution.land}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        <button 
          onClick={generateMap}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200"
        >
          Generate Map
        </button>
      </div>
    </div>
  );
};

MapGeneration.propTypes = {
  onMapGenerated: PropTypes.func.isRequired,
};

export default MapGeneration;