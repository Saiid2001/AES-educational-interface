import { Aes } from "./AesAlg"

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

//Rayan's code starts here:

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// implementation of the following 2 functions is from crypto-js
// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));

    console.log(bytes.length)
    return bytes;
}

function hexToBinary(h) {
    return h.split('').reduce(function(acc, i) {
        return acc + ('000' + parseInt(i, 16).toString(2)).substr(-4, 4);
    }, '')
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

//Function one: expand key
function expandKey(key){
    key = hexToBytes(key);
    return Aes.keyExpansion(key);
}

// I used a different fucntion to get form base 10 to hex because I use the first function in encryption. 

// saiid
function subkeyToHex(subkey){
    let out = ""
    for (var i = 0; i<subkey.length;i++){
       out+=("000"+(subkey[i]).toString(16)).substr(-2, 2);
    }
    return out
}

// saiid
function stateToHex(state){
    let out = ""
    for (var i = 0; i<4;i++){
        for (var j = 0; j<4; j++)
            out+=("000"+(state[j][i]).toString(16)).substr(-2, 2);
    }

    return out
}

function encrypt(data, key){
    var inputKey = expandKey(key);
    data = hexToBytes(data);
    var cipher = Aes.encrypt(data,inputKey);
    
    return {
        'out': stateToHex(cipher.output), 
        'intermediate': cipher.intermediate.map(state=>{return stateToHex(state)}), 
        'subkeys': cipher.subkeys.map(subkey=>{return subkeyToHex(subkey)})
    }; 
    
}

// saiid
function differences(s1,s2){
//implement differences 
    let diff = []

    for (let i = 0; i < s1.length; i++) {
        if(s1[i] != s2[i]) diff.push(i)
    }

    return diff;
}

//saiid
function computeOneRound(data, subkeys){

    var result = Aes.oneRound(Aes.bytesToState(hexToBytes(data)), subkeys, 1, 4)

    return {
        out: stateToHex(result.output),
        intermediate: result.intermediate.map(x=>stateToHex(x))
    }
}

function decrypt(data, key){
    var inputKey = expandKey(key);

    //reverse the key order for decryption
    //inputKey.reverse();

    data = hexToBytes(data);
    var cipher = Aes.decrypt(data,inputKey);
    
    return {
        'out': stateToHex(cipher.output), 
        'intermediate': cipher.intermediate.map(state=>{return stateToHex(state)}), 
        'subkeys': cipher.subkeys.map(subkey=>{return subkeyToHex(subkey)})
    }; 
    
}

export default  {
    encrypt, 
    decrypt, 
    computeOneRound, 
    expandKey,
    hexToBinary,
    differences,
    subkeyToHex
}
