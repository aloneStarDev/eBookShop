FROM node:latest
RUN useradd -ms /bin/bash app
USER app:app
COPY server/ /home/app
WORKDIR "/home/app"
USER root:root
RUN ["mkdir","/data"]
RUN ["npm","install"]
RUN ["chown","-R","app:app","/data"]
RUN ["chown","-R","app:app","/home/app/node_modules"]
USER app:app
ENV PORT=80
ENTRYPOINT ["npm","start"]
