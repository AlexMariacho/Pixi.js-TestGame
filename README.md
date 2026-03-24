# Pixi.js Test Game

Небольшой проект-игра на [Pixi.js](https://pixijs.com/).

## Стек

- Pixi.js
- TypeScript
- Node.js (для локального запуска и сборки)

## Быстрый старт

1. Установите зависимости:

```bash
npm install
```

2. Запустите проект в режиме разработки:

```bash
npm run dev
```

3. Сборка production-версии:

```bash
npm run build
```

4. Проверка типов:

```bash
npm run check
```

5. Локальный предпросмотр сборки:

```bash
npm run preview
```

## Структура

```text
src/
  app/      инициализация Pixi-приложения и bootstrap
  ui/       экраны, менеджер экранов, общие UI-компоненты
  assets/   текстуры, шрифты, figma-артефакты
  utils/    небольшие переиспользуемые хелперы
```

## Примечания

- Используйте Node.js LTS.
- Для проверки типов используйте `npm run check`.
