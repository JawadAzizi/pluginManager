import Plugin from '../classes/Plugin.js'
import Context from '../classes/Context.js'

export default class Todo2 extends Plugin{
    
    constructor(){
        super()
        Context.ctx= {...Context.ctx, Todo2: this}
        console.log('constraction todo plugin')
    }

    init(){
        console.log('initing todo plugin')
    }
    install(){
        console.log("todo plugin installing")
    }

}