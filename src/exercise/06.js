// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import {fetchPokemon, PokemonInfoFallback, PokemonDataView,  PokemonForm} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null
  });

  const {status, pokemon, error} = state;

  React.useEffect(() => {
    if(!pokemonName) {
      return;
    }

    setState({status: 'pending'});
    fetchPokemon(pokemonName).then(
      pokemon => setState({status: 'resolved', pokemon}),
      error => setState({status: 'rejected', error})
    );
  }, [pokemonName]);

  // eslint-disable-next-line default-case
  switch (status) {
    case 'idle':
      return 'Submit a pokemon';

    case 'pending': 
      return <PokemonInfoFallback name={pokemonName}/>

    case 'resolved':
      return <PokemonDataView pokemon={pokemon}/>

    case 'rejected':
      throw error;  
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  function handleReset(){
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
