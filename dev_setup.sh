#!/bin/sh


docker inspect wanchainjsdev > /dev/null 2>&1
if [ $? -eq 1 ]; then
		docker run -itd --network=host --name wanchainjsdev registry.cn-hangzhou.aliyuncs.com/wanglutech/wanchainjs /bin/sh
	fi
docker exec -it wanchainjsdev /bin/sh


