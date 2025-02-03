---
layout: post
title:  PocketBase LLM Web App Tutorial
date:   2025-1-11 00:10:00 -0500
categories: jekyll update
---


<style>
    /* Code block background */
    .highlighter-rouge .highlight {
        background: black;
    }
</style>


## *Introduction*
If you haven't heard of [PocketBase](https://pocketbase.io/) before then I encourage you to click that link and read some of the docs. The project just had its [`v0.24.0`](https://github.com/pocketbase/pocketbase/releases) release the other day and I figured it would be a good time to write a brand-new tutorial on how to use it.

**WARNING:** This is my first dive into this kind of system, I usually do embedded and frontend software engineering. I am not liable if you decide to use any part of my explanation or code in a production setting that causes any kind of harm to you or others.

<br>



## *What is PocketBase?*
It is a backend program that provides access to your website's frontend and runs common backend utilities like:
* User authentication
* File storage
* Database
* Custom interactions with each of the above

The beauty of the project is that it is a [single executable](https://pocketbase.io/docs/) that can be run on Windows/Linux/macOS. This is nice for small projects but requires more work to scale to more instances (horizontal scaling). See this [discussion](https://github.com/pocketbase/pocketbase/discussions/395).



<br>



## *What Are We Building?*
**We'll build a web app that allows users to sign-up and talk to their own LLM instance**. Sounds a little crazy right? It's not as hard as you might think.

The LLM instances won't be very impressive since I want anyone to be able to build and run this project. This means we'll have to assume this will be running on CPU, GPU, and RAM limited devices (in running LLM terms).

**NOTE:** I did not use any AI/LLM in any intentional manner to write this blog or project. I do not have anything against using those tools, I just didn't since I am not in a hurry to finish this and I want to deeply understand the project I am building.


<br>



## *What Technologies Will We Be Using?*
We'll use:

#### **Backend**
* [PocketBase](https://pocketbase.io/) with [Golang extensions](https://pocketbase.io/docs/use-as-framework/)
* [kubernetes](https://kubernetes.io/) (autoscaling LLM worker nodes)

#### **Frontend**
* [NextJS](https://nextjs.org/)
* [React](https://react.dev/)
* Javascript/[Typescript](https://www.typescriptlang.org/)
* [tailwindcss](https://tailwindcss.com/)/[daisyUI](https://daisyui.com/)/[react-daisyUI](https://react.daisyui.com/?path=/docs/welcome--docs)

#### **Testing**
* [jestjs](https://jestjs.io/)
* [puppeteer](https://pptr.dev/)



<br>



## *Development Environment Setup*
#### **General structure**
First things first, create a project folder and init `git`
- **1:** `mkdir pocketbase_llm_web_app`
- **2:** `cd pocketbase_llm_web_app`
- **3:** `git init`

According to the [docs](https://pocketbase.io/docs/#:~:text=The%20prebuilt%20PocketBase%20executable), PocketBase will create two folders:
* `pb_data`
* `pb_migrations`

The documentation mentions that **`pb_data` should not be committed** to `git` (contains user data) but `pb_migrations` can be.

- **5:** Create a `.gitignore` and add that folder to it:

*file: .gitignore*
```
pb_data
```

- **6:** We'll be using PocketBase as a `Go` package so that we have complete control over the backend. According to [this](https://pocketbase.io/docs/go-overview/#getting-started) we can create a `main.go` file and paste the following in it:

*file: main.go*
```Go
package main

import (
    "log"
    "os"

    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/apis"
    "github.com/pocketbase/pocketbase/core"
)

func main() {
    app := pocketbase.New()

    app.OnServe().BindFunc(func(se *core.ServeEvent) error {
        // serves static files from the provided public dir (if exists)
        se.Router.GET("/{path...}", apis.Static(os.DirFS("./pb_public"), false))

        return se.Next()
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
```

NOTE: You can use PocketBase as an executable that allows [extending it with Javascript](https://pocketbase.io/docs/use-as-framework/).

- **7:** Install `Go` on your machine/server from [here](https://go.dev/dl/) (you may need to restart your shells/IDEs/terminals if on Windows after `Go` is auto added to `PATH`).
- **8:** As the above `Go` program says, let's create a `pb_public` folder: `mkdir pb_public`
- **9:** Inside of there, let's create a basic first page `index.html` (we'll move onto React later, let's just see if anything is working yet):

*file: pb_public/main.go*
```html
<!DOCTYPE html>
<html>
    <body>
        <h1>Hello World!</h1>
    </body>
</html>
```

- **10:** Start the server according to [these directions](https://pocketbase.io/docs/go-overview/#:~:text=To%20init%20the%20dependencies%2C):
    1. `go mod init main.go`
    2. `go mod tidy`
    3. `go run . serve` (takes a little bit to start)

Your browser should automatically open to the superuser registration page. Make sure to enter credentials only you know and keep them in a very safe spot.

You can visit [http://127.0.0.1:8090/](http://127.0.0.1:8090/) to see the custom `index.html` page.

At last, you should have a project structure like:
```
pocketbase_llm_web_app
│   .gitignore
│   go.mod
│   go.sum
│   main.go
│
└───.git
│   │   ...
│   
└───pb_data
│   │   ...
│   
└───pb_public
    │   index.html
    
```

#### **Dependencies**