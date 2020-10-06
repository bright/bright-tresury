FROM node:12.10

RUN useradd --home-dir /srv/ --gid node --shell $(which bash) node-runner && \
    mkdir -p /srv/.config && \
    chown -R node-runner:node /srv/.config

USER node

ARG _TARGET_DIR=/srv/backend

ADD --chown=node ./*.json ${_TARGET_DIR}/

WORKDIR ${_TARGET_DIR}

RUN npm ci --verbose

ADD --chown=node ./ ${_TARGET_DIR}/

RUN npm run compile

USER node-runner

CMD npm run main:dist
