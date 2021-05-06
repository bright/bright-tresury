FROM node:14.16.1

RUN useradd --home-dir /srv/ --gid node --shell $(which bash) node-runner && \
    mkdir -p /srv/.config && \
    chown -R node-runner:node /srv/.config

USER node

ARG SERVER_TARGET_DIR=/srv/backend
ARG CLIENT_TARGET_DIR=/srv/www

COPY --chown=node backend/*.json ${SERVER_TARGET_DIR}/
COPY --chown=node www/*.json ${CLIENT_TARGET_DIR}/
COPY --chown=node www/yarn.lock ${CLIENT_TARGET_DIR}/

WORKDIR ${CLIENT_TARGET_DIR}

RUN yarn install

ADD --chown=node www/ ${CLIENT_TARGET_DIR}/

RUN yarn build

WORKDIR ${SERVER_TARGET_DIR}

RUN npm install

ADD --chown=node backend/ ${SERVER_TARGET_DIR}/

RUN npm run compile:docker

CMD npm run main:dist
