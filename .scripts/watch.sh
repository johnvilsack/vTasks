echo "Watching for changes in ~/Desktop/vtasks.zip..."
fswatch -o ~/Desktop/vtasks.zip | while IFS= read -r event; do
  if [[ "$event" == *"CREATED"* ]]; then
    echo "vtasks.zip appeared. Running update.sh..."
    source ~/Documents/GitHub/vtasks/update.sh  # Replace with the actual path to your script
  fi
done