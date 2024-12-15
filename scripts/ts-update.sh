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

./scripts/ts-actions.py $iesdp_dir/_data/actions 0 351 ts/ielib/bg2/actions.d.ts
./scripts/ts-triggers.py $iesdp_dir/scripting/triggers/bg2triggers.htm ts/ielib/bg2/triggers.d.ts
