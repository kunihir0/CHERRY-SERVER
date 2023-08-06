FROM node:current-bullseye-slim AS base
ENV NODE_ENV=development

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run prestart && pnpm run build

FROM base
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

USER node
CMD ["pnpm", "run", "start"]
