// function* generatorId(){
//     let id = 1
//     while(true){
//         yield id 
//         id++
        
//     }
    
// }

function* generatorId(){
    let id = 1
    while(true){
        const inc = yield id
        if(inc != null){
            id += inc
        }
        
    }
    
}





console.log('yollpw');
const generatorObj = generatorId()
console.log(generatorObj.next());
console.log(generatorObj.next());
console.log(generatorObj.next());