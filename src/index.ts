import { bootstrap } from './app/bootstrap';

const container = document.getElementById('app');

if (!container) {
  throw new Error('Root container #app was not found.');
}

void bootstrap(container).catch((error: unknown) => {
  console.error('App bootstrap failed:', error);
});
