

// Created 27/07/2025 by Tommy Mannix

////////////////////////////////////////////////////////////////////////
// This module is designed to handle any requests for hashing 
// Generatehash() create a new hash for storage in the database 
//VerifyHash() compares a plain text with a hashed password returning 
// true or false depending on the outcome
// hashing uses Bcrypt blowfish cypher 
///////////////////////////////////////////////////////////////////////
// include bcrypt 
const bcrypt = require('bcrypt');
///// Set up salt rounds, this is the complexity of the hash////////
const saltRounds = 10; // Typically a value between 10 and 12
/////// Make a new hashed password by passing in the plain text to hash
async function generatehash(userPassword){
    try{
 const salt = await bcrypt.genSalt(saltRounds)
 const hash = await bcrypt.hash(userPassword, salt)  
console.log(hash)
return  hash
    }
    catch(err)
    {
        console.log(err)
    }
}

//////// verify if a plain text matches a stored hashed password
/// output true or false
async function verifyhash(plaintext,storedpassword){
    const outcome = await bcrypt.compare(plaintext, storedpassword)
    return outcome
}

////// Export the module
module.exports = {
    generatehash,
    verifyhash,
    saltRounds
}