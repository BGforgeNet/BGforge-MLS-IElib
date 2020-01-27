# BGforge MLS IElib
Infinity Engine library for [BGforge MLS](https://github.com/BGforgeNet/vscode-bgforge-mls). It can be used standalone as well.

### Usage:

1. Init submodule
  ```
  cd mymod
  git submodule add -b master https://github.com/BGforgeNet/BGforge-MLS-IElib.git lib/bgforge
  git commit -m "added BGforge IElib"
  ```
2. Enable
  ```
  ALWAYS
    INCLUDE ~%MOD_FOLDER%/lib/bgforge/main.tpa~
  END
  ```

__Note__: once you've added a submodule to your repo, new clones will require and additional step: `git submodule update --init --recursive`

### Update

```
git submodule update --remote
git add lib/bgforge
git commit -m "updated BGforge IElib"
```
