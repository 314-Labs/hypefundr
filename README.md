# First time setup guide
Install dependencies
```
npm install
```

Initialize edgedb instance
```
edgedb project init
```

Generate edgedb types
```
npx @edgedb/generate edgeql-js
```

Setup .env file
```
cp .env.example .env
```
Then go into the file and fill in the blanks


# Common tasks
## Updating edgedb client
```
npx @edgedb/generate edgeql-js
```

## Developing


```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
