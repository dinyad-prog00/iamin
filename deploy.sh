
set -e 

build=false
built_cp_to_remote=false
server_cp_to_remote=false
while getopts "brs" opt; do
  case $opt in
    b)
      build=true
      ;;
    r)
      built_cp_to_remote=true
      ;;
    s)
      server_cp_to_remote=true
      ;;
  esac
done


if [ "$build" = true ];then
    echo "Building"
    cd client
    npm run build
    echo "Copying built client to server"
    cp -r build ../server/
    echo Done;
    cd ..
fi


if [ "$server_cp_to_remote" = true ];then
    echo "Synchronizing to tmp folder"
    rsync -a --exclude="node_modules" ./server  tmp/ 
    echo "Done"
    echo
    echo "Deploying all the server to remote server"
    scp -r tmp/server/  ubuntu@51.178.39.80:/home/ubuntu/Documents/iamin/
    echo "Done"
fi

else if [ "$built_cp_to_remote" = true ];then
    echo "Synchronizing to tmp folder"
    rsync -a --exclude="node_modules" ./server  tmp/ 
    echo "Done"
    echo
    echo "Deploying the built to remote server"
    scp -r tmp/server/build/  ubuntu@51.178.39.80:/home/ubuntu/Documents/iamin/server/
    echo "Done"
fi





