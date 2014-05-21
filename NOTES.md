### Server 001

~~~
pm2 start stream.js -i max
pm2 list
sudo pm2 startup ubuntu
~~~

### Server 002

#### /etc/rc.local

~~~
/usr/bin/sudo -u volkan /usr/local/bin/forever start /home/volkan/PROJECTS/node-scale/server/master/master.js
~~~

 you need to `pm2 startup ubuntu` and restart the service to run
 properly on port 80
