#!/bin/bash

set -xeu -o pipefail

# launch from root repo dir
ext_dir="external"
iesdp_dir="$ext_dir/iesdp"
repo="BGforgeNet/iesdp"

if [[ ! -d "$iesdp_dir" ]]; then
  mkdir -p "$ext_dir"
  cd "$ext_dir"
  git clone https://github.com/$repo/
  cd iesdp
  git checkout ielib
  cd ../..
fi

pnpm run ts-update
