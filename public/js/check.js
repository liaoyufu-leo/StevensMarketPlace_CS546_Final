try {
    var states = require("../json/states.json");
    module.exports = {
        check
    };

} catch (error) { }

function check(input, dataType) {
    switch (dataType) {
        case "id":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;
            if (! /^[0-9a-fA-F]{24}$/.test(input)) return false;

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
            if (input == undefined) return false;
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
                let arr = input.match(/[a-zA-Z0-9]+/g);
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
                let arr = input.match(/[a-zA-Z0-9]+/g);
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
                let arr = input.match(/[a-zA-Z]+/g);
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
                let arr = input.match(/[a-zA-Z]+/g);
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
        case "content":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;
            if (input.length > 1000) return false;

            return input;
        case "title":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;
            input = input.toLowerCase();
            if (input.length > 100) return false;

            return input;
        case "price":
            if (input == undefined) return false;
            if (!(input = Number(input))) return false;
            if (input <= 0) return false;

            return input;
        case "photos":
            if (input == undefined) return false;
            if (!Array.isArray(input)) return false;
            if (input.length == 0) return false;
            if (input.length > 9) return false;

            for (let i = 0; i < input.length; i++) {
                if (!(input[i] = check(input[i], "photo"))) return false;
            }

            return input;
        case "photo":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;
            input = input.toLowerCase();
            if (! /^[a-f0-9]{32}\.(jpg|png)$/.test(input)) return false;

            return input;
        case "description":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;
            if (input.length > 1000) return false;

            return input;
        case "keyword":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length==0) return false;

            return input;
        case "payment":
            if (input == undefined) return false;
            if (Object.prototype.toString.call(input) != "[object Object]") return false;
            if (input.type == undefined) return false;
            input.type = input.type.trim();
            input.type = input.type.toLowerCase();
            if (input.type == "cash") {
                if (Object.keys(input).length != 1) return false;
                else return input;
            } else {
                if (Object.keys(input).length != 4) return false;
                if (!(input["card number"] = check(input["card number"], "card number"))) return false;
                if (!(input["valid date"] = check(input["valid date"], "valid date"))) return false;
                if (!(input["security code"] = check(input["security code"], "security code"))) return false;
            }

            return input;
        case "card number":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;

            if (! /^[ 0-9]+$/.test(input)) return false;

            input = ((input) => {
                let arr = input.match(/[0-9]/g);
                return arr.join("");
            })(input);
            if (input.length != 16) return false;

            return input;
        case "valid date":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            input = input.match(/[0-9]{2}\/[0-9]{2}/g);

            if (input.length != 1) return false;
            input = input[0];
            let month = Number(input.slice(0, 2)), year = Number(input.slice(3, 5));
            if (month < 1 && month > 12) return false;
            if (year <= new Date().getFullYear() % 100) return false;

            return input;
        case "security code":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (! /^[0-9]{3}$/.test(input)) return false;

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


