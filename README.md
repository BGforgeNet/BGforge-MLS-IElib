# BGforge MLS IElib
Infinity Engine library to be used with [BGforge MLS](https://github.com/BGforgeNet/vscode-bgforge-mls)

### Usage:

1. Init submodule
  ```
  cd mymod
  git submodule add -b master https://github.com/BGforgeNet/BGforge-MLS-IElib.git lib/ielib
  git commit -m "enabled IElib"
  ```
2. Enable
  ```
  ALWAYS
    INCLUDE ~%MOD_FOLDER%/lib/ielib/main.tpa~
  END
  ```

__Note__: once you've added a submodule to your repo, new clones will require and additional step: `git submodule update --init --recursive`

### Update

```
git submodule update --remote
```
