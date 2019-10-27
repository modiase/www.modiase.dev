var optionButton1 = document.getElementById("option-button-1");
var optionButton2 = document.getElementById("option-button-2");
var option1Paragraph = document.getElementById("option-text-1");
var option2Paragraph = document.getElementById("option-text-2");
var question = document.getElementsByClassName("question")[0];
var answer = document.getElementsByClassName("answer")[0];
function shuffle(l) {
    var result = l.slice();
    var len = l.length;
    for (var i = 0; i < 5 * len; i++) {
        var index1 = (Math.ceil(Math.random() * len) - 1);
        var index2 = (Math.ceil(Math.random() * len) - 1);
        var tmp = result[index1];
        result[index1] = result[index2];
        result[index2] = tmp;
    }
    return result;
}
function showAnswer(e) {
    question.classList.toggle("hidden");
    answer.classList.toggle("hidden");
}
var options = ["Recycling 1000 aluminium cans",
    "A round trip flight to NY", "Doing meat free Mondays for a year",
    "Turning the heating down from 24 degrees to 20 degrees for a month",
];
var shuffled_options = shuffle(options);
console.log(options, shuffled_options);
option1Paragraph.innerHTML = shuffled_options.pop();
option2Paragraph.innerHTML = shuffled_options.pop();
optionButton1.addEventListener("click", function (e) {
    showAnswer(this, e);
}, true);
