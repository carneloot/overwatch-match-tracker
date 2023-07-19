FROM node:18.16-bookworm-slim as base

RUN apt-get update && apt-get install -y ca-certificates fuse3 sqlite3

FROM base as deps

RUN mkdir /app/
WORKDIR /app/

ADD package.json .npmrc package-lock.json ./

RUN npm install

FROM base as production-deps

RUN mkdir /app/
WORKDIR /app/

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json .npmrc package-lock.json ./
RUN npm prune --omit=dev

FROM base as build

RUN mkdir /app/
WORKDIR /app/

COPY --from=deps /app/node_modules /app/node_modules

ADD . .
RUN npm run build

FROM base

ENV FLY="true"
ENV LITEFS_DIR="/litefs"
ENV DATABASE_FILENAME="sqlite.db"
ENV DATABASE_URL="$LITEFS_DIR/$DATABASE_FILENAME"
ENV PRIMARY_REGION="gru"

ENV INTERNAL_PORT="8080"
ENV PORT="8081"
ENV NODE_ENV="production"

RUN mkdir /app/
WORKDIR /app/

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public

ADD . .

COPY --from=flyio/litefs:0.5.1 /usr/local/bin/litefs /usr/local/bin/litefs
ADD other/litefs.yml /etc/litefs.yml
RUN mkdir -p /data ${LITEFS_DIR}

CMD ["litefs", "mount"]
