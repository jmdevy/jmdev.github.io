---
layout: post
title:  Common git and GitHub Situations and Solutions
date:   2023-11-19 00:10:00 -0500
categories: jekyll update
---

## Introduction

This is a personal page dedicated to step by step solutions to common git situations. Guides online are often convoluted and generic, it can be hard to find anything that is actually relevant.

An obvious great place to get all information regarding git is from the documentation [site/book](https://git-scm.com/book/en/v2){:target="_blank"}{:rel="noopener noreferrer"}. The most important chapter of the book is found in [chapter 2](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository){:target="_blank"}{:rel="noopener noreferrer"}.


---


## Terminology
# `git add`
add


---


# Situation #1: Want to start recording files

[Reference](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository#:~:text=Initializing%20a%20Repository%20in%20an%20Existing%20Directory){:target="_blank"}{:rel="noopener noreferrer"}

**Goal: Track local files using version control/`git`**

1. `cd 'directory/with/files'`
2. `git init` (creates `.git` file)
3. `git add -A`
4. `git commit -m "Add initial files"`

At this point the local files in the newly initialized git repository are tracked and ready for pushing to a server (that is talked about later).

`git add` is an important command that is used to prepare files for commiting. What is "commiting?" Commiting is a `git` term meaning to take the current state of the repository you told `git` to track and make it into a sort of snapshot that is then addressed through a commit ID. So, how do you track the files/portion of the repository that we care about? Well that's done through `git add -A` where the [`-A`](https://git-scm.com/docs/git-add#Documentation/git-add.txt--A){:target="_blank"}{:rel="noopener noreferrer"} means track all new, modified, and deleted file changes since the last commit. There are lots of other parameters you can pass to [`git add`](https://git-scm.com/docs/git-add){:target="_blank"}{:rel="noopener noreferrer"} but we'll be using [`-A`](https://git-scm.com/docs/git-add#Documentation/git-add.txt--A){:target="_blank"}{:rel="noopener noreferrer"} the most.


---


# Situation #2: Cloning a repository

[Reference](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository#:~:text=Cloning%20an%20Existing%20Repository){:target="_blank"}{:rel="noopener noreferrer"}

**Goal: Get a local copy of code hosted somewhere else (from a website/server)**

1. `git clone https://github.com/<username>/<repository_name>.git`

GitHub is the most common place to get code from put there are obviously lots of other places code can be hosted (GitLab, SVN, BitBucket, etc.)

Sometimes the cloned git folder/GitHub repository can have submodules. Submodules are git links to locations of other git folders/GitHub projects. If the above command is used then only empty folders for the modules will be cloned. The below command will go through each submodule (even submodules) and clone them too.

* [`git clone --recurse-submodules`](https://git-scm.com/book/en/v2/Git-Tools-Submodules#:~:text=If%20you%20pass-,%2D%2Drecurse%2Dsubmodules,-to%20the%20git){:target="_blank"}{:rel="noopener noreferrer"}