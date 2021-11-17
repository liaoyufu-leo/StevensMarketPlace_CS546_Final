const states = require("../public/states.json");
const mongo = require("mongodb");
const { ObjectId } = require("bson");

module.exports = {
    check
};


function check(input, dataType) {
    switch (dataType) {
        case "id":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;
            if (!mongo.ObjectId.isValid(input)) return false;
            input = ObjectId(input);
            
            return input;
        case "account":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;
            input = input.toLowerCase();
            if (! /^[a-zA-Z0-9]{5,}\@stevens\.edu$/.test(input)) return false;
            
            return input;
        case "password":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            if (input.length < 10) return false;
            if (! /[A-Z]{1,}/.test(input)) return false;
            if (! /[a-z]{1,}/.test(input)) return false;
            if (! /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{1,}/.test(input)) return false;
            
            return input;
        case "nickName":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;
            
            return input;
        case "gender":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;
            if (input != 'male' && input != 'female' && input != 'other') return false;
            
            return input;
        case "address":
            if (Object.prototype.toString.call(input) != "[object Object]") return false;
            if (Object.keys(input).length != 5) return false;

            if (!(input.street = check(input.street, "street"))) return false;
            if (!(input.apt = check(input.apt, "apt"))) return false;
            if (!(input.city = check(input.city, "city"))) return false;
            if (!(input.state = check(input.state, "state"))) return false;
            if (!(input.zipCode = check(input.zipCode, "zipCode"))) return false;

            if (!checkAddress(input.city, input.state, input.zipCode)) return false;

            return input;
        case "street":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;

            input = ((input) => {
                let arr = input.match(/[a-zA-Z0-9]+/g)
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].toLowerCase();
                    arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
                }
                return arr.join(" ");
            })(input);

            return input;
        case "apt":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;

            input = ((input) => {
                let arr = input.match(/[a-zA-Z0-9]+/g)
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].toLowerCase();
                    arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
                }
                return arr.join(" ");
            })(input);

            return input;
        case "city":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;

            input = ((input) => {
                let arr = input.match(/[a-zA-Z]+/g)
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].toLowerCase();
                    arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
                }
                return arr.join(" ");
            })(input);

            return input;
        case "state":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;

            input = ((input) => {
                let arr = input.match(/[a-zA-Z]+/g)
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].toLowerCase();
                    arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
                }
                return arr.join(" ");
            })(input);

            return input;
        case "zipCode":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;
            if (! /^[0-9]{5}$/.test(input)) return false;
            input = parseInt(input);
            
            return input;
        default:
            return false;
    }
}

function checkAddress(city, state, zipCode) {
    let flag = false;
    for (let abber in states) {
        if (state == states[abber].name)
            if (states[abber].cities[city]) {
                if (states[abber].cities[city].includes(zipCode))
                    flag = true;
            }

    }
    return flag;
}


