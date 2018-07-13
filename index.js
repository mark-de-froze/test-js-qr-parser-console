const CRC = require('crc-full').CRC

const data = "00020101021252040000530398054031005802UA5906Coffee6004Kiev64160002UK0106Равлик80850017ua.walvarcard.www010200020840702065032002065171019111321684041212345678901205020181500017ua.walvarcard.www011720170817101010100020412006304BC2C"
const rules = [
    {
        id: 62,
        type: Object
    },
    {
        id: 64,
        type: Object
    },
    {
        id: 80,
        type: Object
    },
    {
        id: 81,
        type: Object
    }
]

let model = []
let crc = null

function parser(data) {
    let model = []
    const lenghtID = 2
    let id = Number(data.substr(0,lenghtID))
    let lenght = Number(data.substr(lenghtID,lenghtID))
    let lenghtBlock = lenghtID + lenghtID + lenght

    let value = data.substr(4,lenght)
    let rule = rules.find(block => block.id === id)

    if(rule) {
        if(rule.type === Object) {
            value = parser(value)
        }
    }

    model.push({ id, lenght, value })

    if(data.length > lenghtBlock) {
        model = [...model, ...parser(data.substr(lenghtBlock))]
    }

    return model
}

function isValid(data, crcParse) {
    let crc = new CRC('CRC16', 16, 0x1027, 0xFFFF, 0x0000, false, false)
    let computedCrc = crc.compute(Buffer.from(data,'ascii'))
    return computedCrc === crcParse
}

model = parser(data)
crc = model.find(block => block.id === 63)
model = model.filter(block => block.id !== 63)

console.log(isValid(data, crc))
console.log(crc)
console.log(model)