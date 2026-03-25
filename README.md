# Pixi.js Test Game

Небольшое UI-приложение на [Pixi.js](https://pixijs.com/) с навигацией между экранами и визуалами, собранными из экспортов Figma.

## Стек

- Pixi.js
- TypeScript
- Vite
- Playwright

## Запуск приложения

1. Установите зависимости:

```bash
npm install
```

2. Запустите приложение в режиме разработки:

```bash
npm run dev
```

После запуска Vite покажет локальный адрес приложения в терминале.

## Полезные команды

- Проверка типов:

```bash
npm run check
```

- Production-сборка:

```bash
npm run build
```

- Локальный просмотр production-сборки:

```bash
npm run preview
```

- Визуальные тесты:

```bash
npm run test:visual
```

## Структура проекта

- `src/app/` — bootstrap приложения и инициализация Pixi
- `src/assets/` — Figma-артефакты, экспортированные текстуры, шрифты и звуки
- `src/ui/manager/` — регистрация экранов и навигация
- `src/ui/screens/` — экраны и screen-specific данные
- `src/ui/components/` — общие UI-компоненты, интерактивность, типографика и rendering helpers
- `src/ui/transitions/` — переходы между экранами
- `src/utils/` — общие вспомогательные функции
- `tests/e2e/` — визуальные и interaction regression tests
- `docs/` — документация по архитектуре, layout, Figma sync и тестированию

## Примечание по Figma и pixel-perfect

В исходной Figma были расхождения в координатах главного блока на экранах `Desktop-3` и `Desktop-4`, поэтому для более точного позиционирования была создана отдельная ветка `PixelPerfect`.

В этой ветке расположение элементов выверено точнее, чем в финальном варианте текущей основной реализации.

## Документация

- [AGENTS.md](./AGENTS.md)
- [docs/ui-architecture.md](./docs/ui-architecture.md)
- [docs/ui-layout-coordinates.md](./docs/ui-layout-coordinates.md)
- [docs/figma-sync.md](./docs/figma-sync.md)
- [docs/testing.md](./docs/testing.md)