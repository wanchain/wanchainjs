#!/bin/sh


curdir=`pwd`
docker inspect wanchainjsdev > /dev/null 2>&1
if [ $? -eq 1 ]; then
		docker run -itd --restart always --network=host --name wanchainjsdev -v "${curdir}/jsutility:/wanchainjs" registry.cn-hangzhou.aliyuncs.com/wanglutech/wanchainjs /bin/sh
	fi
docker exec -it wanchainjsdev /bin/sh


