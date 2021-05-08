# Setting up a serverless container for development

# Use the official node image (TODO: switch to nvm?)
FROM node:lts-alpine as nodeBuilderStage

# Install extra useful packages for alpine version
RUN apk add --no-cache curl && \
    apk add --no-cache bash && \
    apk add --no-cache nano && \
    apk add --no-cache sudo

# Install development packages(beware of versions) TODO: register last working versions
RUN npm install -g npm@lts    
    # npm install -g serverless          # Using serverless installed locally to track version(using npm scripts as aliases) -> TODO: check if commands doesnt become too much verbose with the extas double dashes '--' to isolate npm scripts options from command options
    # apk add --no-cache inotify-tools   # Possible future feature which would monitor folders(such as s3 local) to automatically generate commands(such as s3 aws-cli)

# Install AWS-CLI and glibc for compatibility in alpine
ENV GLIBC_VER=2.31-r0
RUN apk --no-cache add binutils && \
    curl -sL https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub -o /etc/apk/keys/sgerrand.rsa.pub && \
    curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VER}/glibc-${GLIBC_VER}.apk && \
    curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VER}/glibc-bin-${GLIBC_VER}.apk && \
    curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VER}/glibc-i18n-${GLIBC_VER}.apk && \
    apk add --no-cache glibc-${GLIBC_VER}.apk glibc-bin-${GLIBC_VER}.apk glibc-i18n-${GLIBC_VER}.apk && /usr/glibc-compat/bin/localedef -i en_US -f UTF-8 en_US.UTF-8 && \
    curl -sL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscliv2.zip && \
    unzip awscliv2.zip && aws/install && \
    rm -rf \
        awscliv2.zip \
        aws \
        /usr/local/aws-cli/v2/*/dist/aws_completer \
        /usr/local/aws-cli/v2/*/dist/awscli/data/ac.index \
        /usr/local/aws-cli/v2/*/dist/awscli/examples \
        glibc-*.apk && \
    apk --no-cache del binutils && \
    rm -rf /var/cache/apk/*

# Grant privileges to alpine native node user
RUN echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node && \
    chmod 755 /root
# Change and config node user
USER node
RUN echo "complete -d cd" >> ~/.bashrc
RUN echo "PS1='\e[1;30m(\t)[\w]\$ \e[0m'" >> ~/.bashrc; source ~/.bashrc

# Keeps de container running
CMD tail -f /dev/null