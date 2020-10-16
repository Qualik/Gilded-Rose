function Item(name, sell_in, quality) {
    this.name = name;
    this.sell_in = sell_in;
    this.quality = quality;
}

var items = []

// I put this in to show that it won't get overwritten
Item.prototype.report = function report() {
    return `${this.name} (Quality: ${this.name}) needs to be sold in ${this.sell_in} days`;
};

const DEFAULT_TYPE_STRING = "default";

const stockItemAgeingDictionary = {
    // these are the types
    types: {
        legendary: {
            items: ["Sulfuras, Hand of Ragnaros"],
            ageingFn: (item) => item // it never changes
        },
        conjured: {
            items: ["Conjured Mana Cake"],
            ageingFn: (item) => {
                console.log("conjured fn");
                /* adjust item via its particular rules */
            }
        },
        reverse: {
            items: ["Aged Brie"],
            ageingFn: (item) => {
                console.log("reverse fn");
                /* adjust item via its particular rules */
            }
        },
        // default type
        [DEFAULT_TYPE_STRING]: {
            ageingFn: (item) => {
                console.log("default fn");
                /* adjust item via its particular rules */
            }
        }
    },

    // this finds the type by checking all the types above's arrays for a match...
    findType(name) {
        const { types } = this;
        for (let key in types) {
            if (types.hasOwnProperty(key)) {
                if (key !== DEFAULT_TYPE_STRING && types[key].items.includes(name)) {
                    return key;
                }
            }
        }
        return DEFAULT_TYPE_STRING; // if not found default type is applied
    }
};

/****************************************
Class which extends to add functionality
*****************************************/
function AgeMonitoredItem(item) {
    if (!new.target) {
        throw new Error(
            "AgeMonitoredItem is a constructor and must be called with the 'new' keyword"
        );
    }
    Object.assign(this, item); // copy item properties
    this.ageingType = stockItemAgeingDictionary.findType(item.name); // then gives it a type
}

AgeMonitoredItem.prototype = Object.create(Item.prototype);
AgeMonitoredItem.prototype.constructor = AgeMonitoredItem;

// add my method
AgeMonitoredItem.prototype.ageItem = function () {
    stockItemAgeingDictionary.types[this.ageingType].ageingFn(this);
};

AgeMonitoredItem.prototype.eject = function () {
    return new Item(this.name, this.sell_in, this.quality)
};

function update_quality() {
    for (let [i, item] of items.entries()) {

        if (item instanceof AgeMonitoredItem) {
            item.ageItem();
        } else if (item instanceof Item) {
            items[i] = item = new AgeMonitoredItem(item);
            item.ageItem();
        } else {
            throw new Error(`Non-Item found in items: ${JSON.stringify(item)}`);
        }
    }
    console.log("New Items", items);
}



