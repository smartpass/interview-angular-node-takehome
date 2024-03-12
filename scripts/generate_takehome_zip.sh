# This file is not part of the take-home assessment.
# It produces a zip that candidates can download.

#!/bin/bash

# Ensure the script exits on any error
set -e

# Define variables for directory names and archive name
ARCHIVE_NAME="smartpass_takehome"

# Create the bin and tmp directory if it doesn't exist
mkdir -p "bin/tmp"

# Step 1: Archive the current git repository
git archive --format zip --output bin/${ARCHIVE_NAME}.zip HEAD

# Step 2: Unzip the archive to a temporary directory within another directory named as the archive
unzip bin/${ARCHIVE_NAME}.zip -d bin/tmp/${ARCHIVE_NAME}

# Step 3: Initialize a new git repository in the new directory
cd bin/tmp/${ARCHIVE_NAME}
git init
git add .
git commit -m "Initial commit"

cd ..
zip -r ./${ARCHIVE_NAME}.zip ./${ARCHIVE_NAME}
cd ..
mv ./tmp/${ARCHIVE_NAME}.zip ./${ARCHIVE_NAME}.zip

# Step 5: Cleanup the temporary directory
rm -rf ./tmp

echo "Archive created at bin/${ARCHIVE_NAME}.zip"

