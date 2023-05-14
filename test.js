import { ChildProcess, spawn } from "child_process";
import express from "express";
import { readFileSync, writeFileSync } from "fs";

class BasePlugin {
  onInit(ctx) {
    console.log("plugin on Init", ctx);
  }

  onBuild(ctx) {
    console.log("plugin on build", ctx);
  }

  onActive() {
    console.log("activated");
  }

  onDisable() {
    console.log("onDisabled");
  }
}

class PluginManager {
  allPlugins = {};
  plugins = [];
  onCleans = [];

  filterPlugins(config) {
    Object.keys(config).map((key) => {
      if (config[key]) {
        this.plugins.push(new allPlugins[key]());
      }
    });
  }

  constructor(allPlugins) {
    this.allPlugins = allPlugins;
  }

  async init(config) {
    this.filterPlugins(allPlugins, config);
    let ctx = {
      restart: (config) => {
        this.restart(config);
      },
    };
    for (let plugin of this.plugins) {
      this.onCleans.push(await plugin.onInit(ctx));
    }

    return ctx;
  }

  async build(config) {
    this.filterPlugins(allPlugins, config);
    let ctx = {};
    for (let plugin of this.plugins) {
      await plugin.onBuild(ctx ?? {});
    }

    return ctx;
  }

  async restart(config) {
    console.log("restart");
    process.on("exit", () => {
      console.log("spawn");
      const res = spawn("node test.js &");
      console.log(res);
      setTimeout(() => {}, 1000);
    });
    process.exit(1);
    // for (let callback of this.onCleans.filter(Boolean)) {
    //   console.log("cleanup ", callback);
    //   await callback();
    // }

    // console.log("finished");
    // this.init(config);
  }

  async active(plugin) {
    this.plugins.push(plugin);
    await plugin.onActive();
  }

  async disable(plugin) {
    await plugin.onDisable();
    this.plugins = this.plugins.filter((p) => p !== plugin);
  }
}

class TodosPlugin extends BasePlugin {
  onInit(ctx) {
    ctx.routes.get("/todos", (req, res) => {
      res.send("working");
    });
    console.log("todosPlugin onInit", ctx);
  }
}

class PagesPlugin extends BasePlugin {
  onInit(ctx) {
    ctx.addPage = "test add page";
    console.log("pagesPlugin onInit", ctx);
  }
}

class SveltePlugin extends BasePlugin {
  onBuild() {
    console.log("build svelte files");
  }
}

class ExpressPlugin extends BasePlugin {
  onInit(ctx) {
    console.log("create new app");
    let app = express();

    ctx.getApp = () => app;

    ctx.addMiddleware = (handler) => {
      app.use(handler);
    };

    ctx.routes = {
      get(slug, handler) {
        app.get(slug, handler);
      },
      post(slug, handler) {
        app.post(slug, handler);
      },
      put(slug, handler) {
        app.put(slug, handler);
      },
      patch(slug, handler) {
        app.patch(slug, handler);
      },
      delete(slug, handler) {
        app.delete(slug, handler);
      },
    };

    const server = app.listen(3002, () => {
      console.log("listening on port 3002");
    });

    return () => {
      return new Promise((resolve) => {
        delete ctx.routes;
        delete ctx.getApp;
        delete ctx.addMiddleware;
        server.close((err) => {
          console.log({ err });
          resolve();
        });
      });
    };
  }
}

class PluginsPlugin extends BasePlugin {
  onInit(ctx) {
    ctx.routes.get("/disable", (req, res) => {
      const config = getConfig();

      config.todos = false;
      setConfig(config);

      res.send("Todos plugin disabled");
    });

    ctx.routes.get("/enable", (req, res) => {
      const config = getConfig();

      config.todos = true;
      setConfig(config);

      res.send("Todos plugin enabled");
    });

    ctx.routes.get("/restart", (req, res) => {
      ctx.restart(getConfig());
    });
  }
}

let allPlugins = {
  express: ExpressPlugin,
  plugins: PluginsPlugin,
  svelte: SveltePlugin,
  pages: PagesPlugin,
  todos: TodosPlugin,
};

function getConfig() {
  let content = readFileSync("./config.json", "utf-8");

  return JSON.parse(content);
}

function setConfig(config) {
  let data = JSON.stringify(config);

  writeFileSync("./config.json", data);

  //   manager1.restart(getConfig());
}

console.log("test init step");

const manager1 = new PluginManager(allPlugins);

manager1.init(getConfig());
