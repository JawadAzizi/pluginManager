import Plugin from '../classes/Plugin.js'
import Context from '../classes/Context.js'

export default class Todo extends Plugin{
    
    constructor(){
        super()

        Context.ctx = {...Context.ctx, Todo : this}
        console.log('constraction todo plugin', Object.getPrototypeOf(this).constructor.name)
    }

   onInit(){
        Context.ctx.Todos = []
        Context.ctx.addTodo =function(todo){
            Context.ctx.Todos= [...Context.ctx.Todos?? undefined, {name: todo.name, description: todo.description}]
        }
    }
    onInstall(){
        console.log("todo plugin installing")
        this.isInstalled = true
    }

}