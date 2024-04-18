import { v4 as uuidv4 } from 'uuid'

function generateUniqueCode(){
    return uuidv4()
}

function calculateTotalAmout(products) {
    let total = 0;
    for (const item of products) {
        total += item.quantity * item.price
    }
    return total
}

export { generateUniqueCode, calculateTotalAmout }