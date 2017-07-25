FROM jkilbride/node-npm-alpine:6

ADD ./jsutility /wanchainjs

RUN apk upgrade --update \
    && apk add --no-cache \
        libstdc++ \
    && apk add --no-cache --virtual .build-deps \
        binutils-gold \
        curl \
        g++ \
        gcc \
        gnupg \
        libgcc \
        linux-headers \
        make \
        python
RUN npm install -g rlp@2.0.0  ethereumjs-util@5.1.2 web3@0.19.1 ethereumjs-tx@1.1.2  solc@0.4.13 keccakjs@0.2.1 

ENV NODE_PATH /usr/lib/node_modules
WORKDIR /wanchainjs

#replace ethereumjs library files with wanchain extended
RUN cp /wanchainjs/ethereumjs_extended/ethereumjs-tx/index.js /usr/lib/node_modules/ethereumjs-tx/index.js &&  \
    cp /wanchainjs/ethereumjs_extended/ethereumjs-util/index.js /usr/lib/node_modules/ethereumjs-util/index.js &&  \
    cp /wanchainjs/ethereumjs_extended/rlp/index.js /usr/lib/node_modules/rlp/index.js 




