const fs = require("fs");

const members = fs.readFileSync("members.txt").toString().split("\n")
const mems = [];

const fixedMembers = [];

let i=0;
for (let memberRow of members) {
    if (!memberRow.match(/\d/)?.index) {
        fixedMembers[i - 1] += " " + memberRow
    } else {
        fixedMembers.push(memberRow)
        i++;
    }

}


for (let memberRow of fixedMembers) {

    const firstDigit = memberRow.match(/\d/);
    let member = memberRow.substring(0, firstDigit.index);
    mems.push(member.split(",").reverse().join(" ").replace(/ +/g, ' '));
}

fs.writeFileSync("members.json", JSON.stringify(mems, null, 2));
