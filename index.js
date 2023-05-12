//In the name of Ullah
console.log("Ubuilder starting...")
           
// todos : 
//1. plugin type
//2. base Plugin class: Plugin
//3. system for management of plugins
//4. todo plugin 


import Todo from './plugins/Todo.js'
import PluginManager  from './classes/PluginManager.js'
import Todo2 from './plugins/Todo2.js'

// this Context.ctx is a stitic prop that can be accessed at any place
import Context from './classes/Context.js'

let manager = new PluginManager()

let todo = new Todo()
let todo2= new Todo2()

// manager.add(todo)
// manager.add(todo2)
manager.addAll(todo, todo2)

manager.install(todo)
manager.install(todo2)


manager.start()
Context.ctx.addTodo({name: 'todo1', description: 'no des'})

console.log("ctx: ", Context.ctx )
