import Context from "./Context.js"
export default class PluginManager {    
    constructor(){
        //key : Name of class, value: class object
        this.plugins = {}
        
    }
    add(plugin){
        this.plugins[plugin.name] = plugin
    }
    addAll(...arg){
        arg.map((plugin)=> this.plugins[plugin.name] = plugin)
    }
    start(plugin){
        Object.values(this.plugins).map((plug)=>plug.onInit())
    }
    get(plugin){
        return this.plugins[plugin.name]
    }
    uninstall(plugin){
        this.plugins[plugin.name].onUninstall(this.ctx)
    }
    install(plugin){
        this.plugins[plugin.name].onInstall(this.ctx)
    }
}
