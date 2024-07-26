FROM node:20.11-alpine

# setup work directory in container
WORKDIR /home/node/app

# copy file into work directory
COPY . /home/node/app

# make owner user node
RUN chown -R node:node /home/node

# set user node
USER node

# install dependency packages
RUN cd /home/node/app && npm ci && \
  # build code, kebentuk dist
  npm run build

# optional: expose port
EXPOSE 9000

CMD [ "yarn","start"]