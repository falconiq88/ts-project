#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ubuntu/ts-app/

#navigate into our working directory where we have all our github files
cd /home/ubuntu/ts-app/

#add npm and node to path
# export NVM_DIR="$HOME/.nvm"	
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
npm install

# sudo npx prisma generate
#start our node app in the background
# sudo node index.js > index.out.log 2> index.err.log < /dev/null &