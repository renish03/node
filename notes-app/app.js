const fs=require("fs");
const notes=require("./notes");
// get paramter passed by user
const command=process.argv[2];
const yargs=require("yargs")

//console.log(process.argv);
yargs.command({
    command:'list',
    describe:'get file data',
    handler(){
        notes.listNotes();
    }
})

yargs.command({
    command:'read',
    describe:'read notes',
    builder:{
        title:{
            describe:'this is title',
            demandOption:true,
            type:'string'  
        }
    },
    handler(argv){
        notes.readNote(argv.title);
    }
})
yargs.command({
  command:'add',
  describe:'this is adding Note',
  builder:{
      title:{
          describe:'this is title',
          demandOption:true,
          type:'string'
      },
      body:{
        describe:'this is title',
        demandOption:false,
        type:'string'
      }
  },
  handler(argv){
    //console.log('adding new note Title:'+argv.title);
    //console.log('adding new note Body:'+argv.body);
    notes.addNote(argv.title,argv.body);
  }
})

yargs.command({
    command:'remove',
    describe:'remove data from file',
    builder:{
        title:{
        desrcibe:'this is title',
        demandOption:true,
        type:'string'}
    },
    handler(argv){
        notes.removeNote(argv.title);
    }
})
yargs.parse()
//console.log(yargs.argv);

//Run below command
// Add Note Command:node app.js add --title="test8" --body="body8"
// List Note:node app.js list
// Read Note:node app.js read --tile="test8"
// delete note:node app.js remove --title="test8"
