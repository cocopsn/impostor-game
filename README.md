# Impostor

Juego de "el impostor" para jugar en un solo teléfono que se pasa de mano en mano.
Todos ven la palabra menos uno; el resto tiene que descubrirlo antes de que él adivine.

Next.js 16 (App Router) · TypeScript · Tailwind · Framer Motion. **Sin backend, sin
cuentas, sin red**: la partida entera vive en el estado del cliente.

## Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:3000
```

La entrada es `app/page.tsx`.

## Cómo está armado

| Pieza | Dónde |
|---|---|
| Reglas de la partida (elegir palabra, repartir roles, contar votos) | `lib/gameLogic.ts` |
| Estado y temporizador | `hooks/useGameState.ts` · `hooks/useTimer.ts` |
| Tipos del dominio | `types/game.ts` |
| Banco de palabras | `components/WordBank.ts` |
| Pantallas | `components/screens/` — 8: Home · Setup · RoleReveal · GameRound · Voting · ManualVote · RoundResult · GameOver |

## Banco de palabras

**14 categorías** (Futbol, Futbol Americano, Cine, Animales, Comida, Lugares, Musica,
Videojuegos, Ciencia y Tecnologia, Series y TV, Superheroes y Ficcion, Marcas y
Empresas, …). Se pueden **agregar palabras propias** desde la pantalla de configuración;
entran al mismo bote bajo la categoría "Personalizada" (`lib/gameLogic.ts → selectWord`).

## Estado

Proyecto personal, público, sin pruebas automatizadas. No hay `test` ni `typecheck`
en `package.json` — solo `dev`, `build`, `start` y `lint`.
