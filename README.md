This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker

You can build and run this application as a container:

### 1. Build the image
```bash
docker build -t ai-cover-letter-generator .
```

### 2. Run the container
```bash
docker run -p 3000:3000 ai-cover-letter-generator
```

> [!IMPORTANT]
> Since Ollama runs on your local machine, the container needs special access to reach the host. Ensure Ollama is running, and if you are on Mac/Windows, the application should automatically reach the host. On Linux, you might need to use `--add-host=host.docker.internal:host-gateway` and ensure your Ollama is listening on all interfaces.

## Deploy on Vercel
