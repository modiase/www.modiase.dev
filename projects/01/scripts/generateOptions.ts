
let optionButton1: HTMLElement= document.getElementById("option-button-1");
let optionButton2 : HTMLElement = document.getElementById("option-button-2");
let option1Paragraph: HTMLElement = document.getElementById("option-text-1");
let option2Paragraph: HTMLElement = document.getElementById("option-text-2");
let question : Element = document.getElementsByClassName("question")[0]
let answer : Element = document.getElementsByClassName("answer")[0]


function shuffle<T>(l: Array<T>) {
    let result = l.slice()
    let len: number = l.length;
    for (let i = 0; i < 5 * len; i++) {
        let index1: number = (Math.ceil(Math.random() * len) - 1);
        let index2: number = (Math.ceil(Math.random() * len) - 1);

        let tmp: T = result[index1];
        result[index1] = result[index2];
        result[index2] = tmp;
    }
    return result



}

function showAnswer(this,e){
    question.classList.toggle("hidden");
    answer.classList.toggle("hidden");
}

var options: Array<String> = ["Recycling 1000 aluminium cans",
    "A round trip flight to NY", "Doing meat free Mondays for a year",
    "Turning the heating down from 24 degrees to 20 degrees for a month",
]

let shuffled_options = shuffle(options);
console.log(options, shuffled_options);


option1Paragraph.innerHTML = shuffled_options.pop();
option2Paragraph.innerHTML = shuffled_options.pop();


optionButton1.addEventListener("click",function(e){
    showAnswer(this,e);
},true)