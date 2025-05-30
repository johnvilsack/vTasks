ditto -xk ~/Desktop/vtasks.zip ~/Desktop/vtasks/
sed -i '' '/<script type="importmap">/,/<\/script>/d' ~/Desktop/vtasks/index.html
rm -rf ~/Desktop/vtasks/.github
cp -Rf ~/Desktop/vtasks/* ~/Documents/GitHub/vtasks/