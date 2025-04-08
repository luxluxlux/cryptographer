# TODO: Install npm-dependencies and build static files
FROM tiangolo/uwsgi-nginx-flask:python3.11
RUN apt-get update
RUN apt-get --assume-yes install bash nano
ENV STATIC_URL /client/build
ENV STATIC_PATH /var/www/app/client/build
COPY ./server/requirements.txt /var/www/app/server/requirements.txt
RUN pip install -r /var/www/app/server/requirements.txt