'use client'
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const types = [
  "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground",
  "flying", "psychic", "bug", "rock", "ghost", "dark", "dragon", "steel", "fairy"
];

const PokemonFilterMenu = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1050');
        const data = await response.json();
        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            return await detailResponse.json();
          })
        );
        setPokemonList(detailedPokemon);
        setFilteredList(detailedPokemon);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterPokemon(term, selectedTypes);
  };

  const toggleType = (type) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updatedTypes);
    filterPokemon(searchTerm, updatedTypes);
  };

  const filterPokemon = (term, types) => {
    const filtered = pokemonList.filter(pokemon => 
      pokemon.name.toLowerCase().includes(term) &&
      (types.length === 0 || types.some(type => pokemon.types.some(t => t.type.name === type)))
    );
    setFilteredList(filtered);
  };

  if (loading) {
    return <div className="text-center p-4">正在加載寶可夢數據...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Input
        type="text"
        placeholder="搜索寶可夢..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {types.map(type => (
          <Button
            key={type}
            variant={selectedTypes.includes(type) ? "default" : "outline"}
            onClick={() => toggleType(type)}
            className="text-sm"
          >
            {type}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredList.map(pokemon => (
          <Card key={pokemon.id}>
            <CardContent className="p-4">
              <img 
                src={pokemon.sprites.front_default} 
                alt={pokemon.name} 
                className="w-32 h-32 mx-auto"
              />
              <h3 className="text-center font-bold mt-2 capitalize">{pokemon.name}</h3>
              <div className="flex justify-center gap-1 mt-2">
                {/* {pokemon.types.map(typeInfo => (
                //   <Badge key={typeInfo.type.name} variant="secondary">
                //     {typeInfo.type.name}
                //   </Badge>
                ))} */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PokemonFilterMenu;