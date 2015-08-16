# SSDM - Stupid Simple Dotfiles Manager #

[![Build Status](https://travis-ci.org/gjbianco/ssdm.svg?branch=master)](https://travis-ci.org/gjbianco/ssdm) [![Coverage Status](https://coveralls.io/repos/gjbianco/ssdm/badge.svg?branch=master&service=github)](https://coveralls.io/github/gjbianco/ssdm?branch=master) [![Join the chat at https://gitter.im/gjbianco/ssdm](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gjbianco/ssdm?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

SSDM uses git to track your dotfiles straight from your home directory (or wherever you want it to live) _without_ interference. You can leave your dotfiles right where they are and just use SSDM to back them up.

SSDM is a helper tool for the similarly named dotfiles management technique. If you ever want to stop using SSDM with your dotfiles, then you can just stop using it! You can continue to use the technique manually or without installing SSDM (e.g. on other machines).

# Technique #

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

# Usage #

SSDM uses a set of basic subcommands that act as basic macros to deal with the underlying git repository. At its core, SSDM will handle renaming .git and .gitignore to .ssdm and .ssdmignore, respectively.

Every command (other than init) run inside of a "context" where repository and directory and ignore file have the real "git version" of the names. Since this step is necessary in order to have git actually deal with the repo as a repo, this means that SSDM has to refuse dealing with anything other than .ssdm and .ssdmignore. This is so it does not accidentally mess with a non-SSDM git repository.

The currently supported commands are as follows:

## init ##

This command initializes a new SSDM (git) repository. It also adds a basic ignore file (using the whitelist technique).

##### Example: #####
```
ssdm init
```

## addfile <pattern> ##

Add a file pattern to the whitelist. Subsequent commands will now deal with files matching this pattern.

##### Example: #####
```
ssdm addfile .bashrc
```

## commit ##

Make a new commit, automatically adding all new and/or changed files that match the whitelisted patterns.

##### Example: #####
```
ssdm commit
```

## git <command> ##

Call a git command from within the SSDM context.

## list ##

List the currently track_able_ files (i.e. whitelisted). These files are not necessarily tracked or even exist.

##### Example: #####
```
ssdm git push origin master
```
