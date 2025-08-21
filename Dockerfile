FROM node:20-alpine

WORKDIR /app

# Copy package manifests first for caching
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install deps (prefer pnpm if lockfile exists)
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
    elif [ -f package-lock.json ]; then npm install; \
    else yarn install; fi

# Accept build arg
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Copy the rest of the frontend
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
