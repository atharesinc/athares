# DEPLOYMENT

# Deploy front end
# cd ~/Documents/react/athares/rn-web
expo build:web
date +%Y-%m-%dT%H:%M:%S > web-build/version.txt
# upload the new compiled files to the s3 bucket and delete whatever wasn't overwritten
# also set the service worker and index.html so that they don't cache so aggressively
aws s3 sync ./web-build s3://www.athar.es --delete --exclude '.DS_Store' --cache-control max-age=86400
aws s3 cp s3://www.athar.es/service-worker.js s3://www.athar.es/service-worker.js --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type application/javascript --acl public-read
aws s3 cp s3://www.athar.es/index.html s3://www.athar.es/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read
aws s3 cp s3://www.athar.es/manifest.webmanifest s3://www.athar.es/manifest.webmanifest --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type application/json --acl public-read
