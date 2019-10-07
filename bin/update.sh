find . -not -path '*git*' -path 'bin' -type f -printf '%P\n' | xargs -I '{}' gsutil cp '{}' gs://www.modiase.co.uk/'{}'
