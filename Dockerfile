FROM jkilbride/node-npm-alpine:6

ADD ./jsutility /jsutility

RUN apk add --update python

RUN npm install -g rlp@2.0.0  ethereumjs-util@5.1.2 web3@0.19.1 ethereumjs-tx@1.3.1  solc@0.4.13

ENV NODE_PATH /usr/lib/node_modules

#replace ethereumjs library files with wanchain extended
RUN cp /jsutility/ethereumjs_extended/ethereumjs-tx/index.js /usr/lib/node_modules/ethereumjs-tx/index.js &&  \
    cp /jsutility/ethereumjs_extended/ethereumjs-util/index.js /usr/lib/node_modules/ethereumjs-util/index.js &&  \
    cp /jsutility/ethereumjs_extended/rlp/index.js /usr/lib/node_modules/rlp/index.js 




