import './App.css';
import axios from "axios";
import React, { useState, useEffect } from "react";
import BanList from './components/banlist';

const POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [banList, setBanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const fetchRandomPokemon = async () => {
    setLoading(true);
    try {
      let validPokemon = false;
      let attempts = 0;
      let pokemonData = null;

      while (!validPokemon && attempts < 10) {
        const randomId = Math.floor(Math.random() * 898) + 1;
        const response = await axios.get(`${POKEAPI_URL}${randomId}`);
        pokemonData = response.data;

        const bannedTypes = banList.filter(attr => attr.startsWith("Type: "));
        const bannedAbilities = banList.filter(attr => attr.startsWith("Ability: "));

        const hasBannedType = pokemonData.types.some(type => 
          bannedTypes.includes(`Type: ${type.type.name}`)
        );
        const hasBannedAbility = pokemonData.abilities.some(ability => 
          bannedAbilities.includes(`Ability: ${ability.ability.name}`)
        );

        if (!hasBannedType && !hasBannedAbility) {
          validPokemon = true;
        }
        attempts++;
      }

      if (validPokemon) {
        setPokemon(pokemonData);
      } else {
        alert("No Pokémon found matching your filters. Try removing some bans.");
      }
      setAttempts(attempts);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  const addToBanList = (attr) => {
    if (!banList.includes(attr)) {
      setBanList([...banList, attr]);
      fetchRandomPokemon();
    }
  };

  const removeFromBanList = (attr) => {
    setBanList(banList.filter(item => item !== attr));
    fetchRandomPokemon();
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <h1>Pokémon Explorer</h1>
        
        <button
          onClick={fetchRandomPokemon}
          className="discover-button"
          disabled={loading}
        >
          {loading ? "Loading..." : "Discover Pokémon"}
        </button>

        {pokemon && (
          <div className="pokemon-display">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="pokemon-image"
            />
            <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            
            <div className="attributes">
              <div className="attribute-section">
                <h3>Types</h3>
                <div className="attribute-buttons">
                  {pokemon.types.map((type, index) => (
                    <button
                      key={index}
                      className="attribute-button"
                      onClick={() => addToBanList(`Type: ${type.type.name}`)}
                    >
                      {type.type.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="attribute-section">
                <h3>Abilities</h3>
                <div className="attribute-buttons">
                  {pokemon.abilities.map((ability, index) => (
                    <button
                      key={index}
                      className="attribute-button"
                      onClick={() => addToBanList(`Ability: ${ability.ability.name}`)}
                    >
                      {ability.ability.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="debug-info">
          <p>Attempts: {attempts}</p>
        </div>
      </div>

      <div className="ban-list-sidebar">
        <BanList banList={banList} onRemove={removeFromBanList} />
      </div>
    </div>
  );
}

export default App;