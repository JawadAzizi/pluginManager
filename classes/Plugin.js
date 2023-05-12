export default class Plugin{
    name;
    description;

    //isActive and isInstalled should be saved in db
    isActive=false;
    isInstalled=false;
    
    constructor(){   
        this.name = Object.getPrototypeOf(this).constructor.name

        //retrive these states from db
        this.isActive = true
        this.isInstalled = true
        
    }
    onInit(){
        if(!this.isActive) return new Error(`plugin ${this.name} is not active`)
        //implement in child
        

    }
    onInstall(){
        //change the status to installed
        this.isActive = true
    } 
    onUninstall(){
        //change the status to uninstalled
        this.isInstalled = false
    }
}