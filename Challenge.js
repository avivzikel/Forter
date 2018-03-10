var csv = require('fast-csv');
var dbFile = 'dbNames.csv';

var nicknamesArr = [];


function test(){
  //loading the nicknames db.
  csv.fromPath(dbFile, {headers: true})
  .on("data", data => {
    nicknamesArr.push(data);
  })
  .on("end", () => {

    console.log(countUniqueNames('Deborah', 'Egli', 'Deborah', 'Egli', 'Deborah Egli')==1);
    console.log(countUniqueNames('Deborah', 'Egli', 'Debbie', 'Egli', 'Debbie Egli')==1);
    console.log(countUniqueNames('Deborah', 'Egni', 'Deborah', 'Egli', 'Deborah Egli')==1);
    console.log(countUniqueNames('Deborah S', 'Egli', 'Deborah', 'Egli', 'Egli Deborah')==1);
    console.log(countUniqueNames('Michele', 'Egli', 'Deborah', 'Egli', 'Michele Egli')==2);


  });
}
test()
function countUniqueNames(billFirstName,billLastName,shipFirstName,shipLastName,billNameOnCard){
  // handling the bill/ship names
  let bill_first = billFirstName.split(' ')[0];
  // Middle Names are ignored since they could be emitted.
  let ship_first = shipFirstName.split(' ')[0];

  let card_names = billNameOnCard.split(' ');
  let card_first = card_names[0];
  let card_last = card_names[card_names.length-1];


  const billEqualsShip = compareFullNames(bill_first, billLastName, ship_first, shipLastName);
  const billEqualsCard = compareFullNames(bill_first, billLastName, card_first, card_last);
  const shipEqualsCard = compareFullNames(ship_first, shipLastName, card_first, card_last);

  var count = billEqualsCard || shipEqualsCard ? 1 : 2;
  return  billEqualsShip ? count : count + 1;
}
//Wrapped function handling swapped names
function compareFullNames(srcFirst, srcLast, checkedFirst,checkedLast) {

  return (compareNames(srcFirst, checkedFirst) && compareNames(srcLast, checkedLast))||
   (compareNames(srcFirst, checkedLast) && compareNames(srcLast, checkedFirst));
}

function nickNameCheck(srcName,checkedName){


  for (i in nicknamesArr){
    if((TypoCompare(nicknamesArr[i].name,srcName) && TypoCompare(nicknamesArr[i].nickname,checkedName))||
    (TypoCompare(nicknamesArr[i].name,checkedName) && TypoCompare(nicknamesArr[i].nickname,srcName))){
      return true;
    }
  }
  return false;


}
//  chceking for typos or nicknames.
function compareNames(srcName, checkedName) {
  return TypoCompare(srcName, checkedName) || nickNameCheck(srcName,checkedName)
};

function stringChecking(srcName,checkedName){
  let misses = 0;
  let i = srcName.length
  while(i--)
  {
    if(srcName[i]!==checkedName[i]){
      misses++;
    }
  }
  return misses < 2;
}


function TypoCompare(srcName, checkedName) {
    return srcName===checkedName ? true : srcName.length !== checkedName.length ? false : stringChecking(srcName,checkedName)

}
exports.countUniqueNames = countUniqueNames;
