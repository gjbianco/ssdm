# SSDM - Stupid Simple Dotfiles Manager #

SSDM uses git to track your dotfiles straight from your home directory (or wherever you want it to live) _without_ interference. You can leave your dotfiles right where they are and just use SSDM to back them up.

SSDM is a helper tool for the similarly named dotfiles management technique. If you ever want to stop using SSDM with your dotfiles, then you can just stop using it! You can continue to use the technique manually or without installing SSDM (e.g. on other machines).

# Stupid Simple Dotfiles Management Technique #

SSDM uses git by managing the naming of the .git directory and .gitignore file. When not directly being called, .git gets renamed to .ssdm and .gitignore gets renamed to .ssdmignore. This allows us to store the actual git repo wherever we want without worrying about conflicting subdirectories.

On top of that, the .gitignore (.ssdmignore) file uses a whitelist technique to make sure git _only_ deals with files and directories specifically listed. e.g.

```
*
!.bashrc
!.vimrc
!.vimrc
```

# Installation #

SSDM is written in Node and can be installed with `npm i -g ssdm`. This will install it globally and you can now run `ssdm` like any other command. Run it without arguments or with the `-h` option to get usage information.
