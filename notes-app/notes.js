const fs=require("fs");
const chalk=require("chalk");

const command=process.argv[2];
const listNotes=function(){
   const mydata=loadNotes();
   console.log(chalk.green.inverse('Your Notes'));
   mydata.forEach((note)=>{
      console.log(note.title);
   });
   
}

const readNote=(title)=>{
  const notes=loadNotes();
  const note = notes.find((note) => note.title === title)
  
  if(note){
    console.log(chalk.green.inverse(note.title));
    console.log(note.body);
  }else{
    console.log(chalk.red.inverse('Note not found!!'))
  }
}
const addNote=(title,body)=>{
  const mynotes=loadNotes();
  const duplicate=mynotes.find((note)=>note.title===title)
  debugger
  if(!duplicate){
    mynotes.push({title:title,body:body})
    //console.log(mynotes);
    saveNotes(mynotes);
    console.log(chalk.green.inverse('New note added!'))
  }else{console.log("Title allready Taken")}
  
}
const saveNotes=(data)=>{
  const datajson=JSON.stringify(data);
  fs.writeFileSync('notes.json',datajson);
}
const loadNotes=()=>{
  try{
    const dataBuffer=fs.readFileSync('notes.json');
    const datajson=dataBuffer.toString();
    const jsonObj=JSON.parse(datajson);
    return jsonObj;
  }catch(e){
    return [];
  }
  
}
const removeNote=(title)=>{
  //console.log("remove Notes")
  const notes=loadNotes();
  const check=notes.filter(function(note){
      return note.title!==title;
  })
  saveNotes(check);
  if(notes.length>check.length){console.log(chalk.green.inverse("Title: " +title+" Sucessfully removed!!")) }
  else{ console.log(chalk.red.inverse("Title: "+title+" does not found!!"))}
}
module.exports={
 listNotes:listNotes,
 addNote:addNote,
 removeNote:removeNote,
 readNote:readNote
}
