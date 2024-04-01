function calcAge(birthYear, firstName) {
    const age = 2039 - birthYear;
    console.log(`${firstName} is ${age} years old`);
    return age;
}
const age = calcAge(1978, 'Whyte');