---
title: "TypeScript函数(下)"
date: 2019-08-06
issue_number: 20
tags: ["TypeScript"]
state: open
source: "https://github.com/joinmouse/Blog/issues/20"
---
### this
在JavaScript里，`this`的值在函数被调用的时候才会指定，当返回一个函数或者将函数作为参数传递的时候就会变的不那么简单，幸运的是，TypeScript能通知你错误地使用了this的地方。还是先来看一个例子
```
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        return function() {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();  // 此时this指向deck

// let cardPick = function() {
//   let pickedCard = Math.floor(Math.random() * 52);
//   let pickedSuit = Math.floor(pickedCard / 13);
//   return {suit: this.suits[pickedSuit], card: pickedCard % 13};
// }

let pickedCard = cardPicker();  //此时this指向window, 严格模式下this是undefined

console.log("card: " + pickedCard.card + " of " + pickedCard.suit);  //error
```

### 箭头函数
通过箭头函数能保存函数创建时的this值，而不是调用时的值，这样就可以解决上面的问题
```
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker(); 
console.log("card: " + pickedCard.card + " of " + pickedCard.suit); 
```
更好事情是，TypeScript会警告你犯了一个错误，如果你给编译器设置了--noImplicitThis标记。 它会指出this.suits[pickedSuit]里的this的类型为any

### this参数
```
interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // NOTE: The function now explicitly specifies that its callee must be of type Deck
    createCardPicker: function(this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();
console.log(("card: " + pickedCard.card + " of " + pickedCard.suit);)
```
这里TypeScript申明createCardPicker期望在某个Deck对象上调用，即this是Deck类型的。


### 重载
JavaScript本身是个动态语言， 函数根据传入不同的参数而返回不同类型的数据是很常见的。
```
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```
为了让编译器能够选择正确的检查类型，它与JavaScript里的处理流程相似。 它查找重载列表，尝试使用第一个重载定义。 如果匹配的话就使用这个。 因此，在定义重载的时候，一定要把最精确的定义放在最前面。



