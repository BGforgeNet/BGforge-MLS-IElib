#!/bin/bash

# Shared script to ensure IESDP repository is cloned and on the correct branch.
# Source this from other scripts: source scripts/ensure-iesdp.sh

set -eu -o pipefail

ensure_iesdp() {
    local ext_dir="external"
    local iesdp_dir="$ext_dir/iesdp"
    local repo="BGforgeNet/iesdp"

    if [[ ! -d "$iesdp_dir" ]]; then
        mkdir -p "$ext_dir"
        git clone "https://github.com/$repo/" "$iesdp_dir" >&2
        git -C "$iesdp_dir" checkout ielib >&2
    fi

    echo "$iesdp_dir"
}
