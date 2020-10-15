describe("Gilded Rose", function() {

  const SellInFieldName = 'sell_in';
  const qualityFieldName = 'quality';
  const nameFieldName = 'name';

  describe("Items in the system", () => {

    it("Items have a sellIn value which shows the number of days left to sell the item", () => {
      const testItem = new Item('+5 Dexterity Vest', 10, 20);
      const keys = Object.keys(testItem);
      const sellInValue = testItem[SellInFieldName];

      expect(keys.includes(SellInFieldName)).toBe(true); // key exists
      expect(typeof sellInValue).toBe('number'); // value is number
      expect(Number.isInteger(sellInValue)).toBe(true); // value is an integer
      expect(sellInValue).toBeGreaterThan(-1); // 0 or above. 
      
    });

    it("Items have a Quality value which shows how valuable the item is", () => {
      const testItem = new Item('+5 Dexterity Vest', 10, 20);
      const keys = Object.keys(testItem);
      const qualityValue = testItem[qualityFieldName];

      expect(keys.includes(qualityFieldName)).toBe(true); // key exists
      expect(typeof qualityValue).toBe('number'); // value is number
      expect(Number.isInteger(qualityValue)).toBe(true); // value is an integer
      expect(qualityValue).toBeGreaterThan(-1); // 0 or above. 
      
    });
  });

  describe("The updateQuality Function", () => {

    beforeEach(function () {
      items.push(new Item('+5 Dexterity Vest', 10, 20));
      items.push(new Item('Aged Brie', 2, 0));
      items.push(new Item('Elixir of the Mongoose', 5, 7));
      items.push(new Item('Sulfuras, Hand of Ragnaros', 0, 80));
      items.push(new Item('Sulfuras, Hand of Ragnaros', -1, 80));
      items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20));
      items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49));
      items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49));

      // this conjured item does not work properly yet
      items.push(new Item('Conjured Mana Cake', 3, 6));

      // twice decay speed
      items.push(new Item('twice decay', 0, 4));

      // Never less than 0
      items.push(new Item('sbd_item', 2, 0));
    });

    afterEach(function () {
      items = [];
    });

    it("End of each day system lowers both 'sell_in' and 'quality' values for every [ordinary] item", () => {
      // before
      const preSellins = [];
      const preQualities = [];

      for (const item of items) {
        console.log(item);
        preSellins.push(item[SellInFieldName]);
        preQualities.push(item[qualityFieldName]);
      }
      // call the fn
      update_quality();

      // after
      for (const [i, item] of items.entries()) {
        console.log(item);

        expect(item[SellInFieldName]).toEqual(preSellins[i] - 1);
        expect(item[qualityFieldName]).toEqual(preQualities[i] - 1);
      }
    });


    it("Quality degrades twice as fast when sell by date has passed", () => {
      const twiceAgeIndex = items.findIndex(item => item.name === 'twice decay');
    
      expect(items[twiceAgeIndex]).toEqual(4);
      update_quality();

      expect(items[twiceAgeIndex]).toEqual(2);
      update_quality();

      expect(items[twiceAgeIndex]).toEqual(0);
    });


    it("quality of an item is never negative", () => {
      // 'sbd_item'

      const sbd_itemIndex = items.findIndex(item => item.name === 'sbd_item');
      expect(items[sbd_itemIndex].quality).toEqual(0);
      update_quality();
      expect(items[sbd_itemIndex].quality).toEqual(0);
    });


    it("Aged Brie increases in 'quality' the older it gets", () => {
      const item = new Item('Aged Brie', 2, 0);
      items.push(item);
      update_quality();
      expect(item.quality).toEqual(1);
    });


    it("quality if an item is never greater than 50", () => {
      const item = new Item("Aged Brie", 3, 50);
      items.push(item);
      update_quality();
      expect(item.quality).toEqual(50);
      // expect().toEqual("");
    });


    it("Sulfuras is a legendary item and never has to be sold", () => {
      const item = new Item('Sulfuras, Hand of Ragnaros', 0, 80);
      update_quality();
      expect(item.sell_in).toEqual(0);
    });

    it("Sulfuras is a legendary item and never decreases in quality", () => {
      const item = new Item('Sulfuras, Hand of Ragnaros', 0, 80);
      update_quality();
      expect(item.quality).toEqual(80);
    });

    it("Sulfuras is a legendary item and never has to be sold", () => {
      const item = new Item('Sulfuras, Hand of Ragnaros', -1, 80);
      update_quality();
      expect(item.sell_in).toEqual(-1);
    });

    it("Sulfuras is a legendary item and never decreases in quality", () => {
      const item = new Item('Sulfuras, Hand of Ragnaros', -1, 80); // this looks like a bug as quality isn't supposed to decrease for legendary items
      update_quality();
      expect(item.quality).toEqual(80);
    });
      

    it("Backstge passes increase in 'quality' as its sellIn value approaches", () => {
      expect().toEqual("");
    });


    it("quality increases by 2 when there 10 days or less", () => {
      expect().toEqual("");
    });


    it("quality increases by 3 when there 5 days or less", () => {
      expect().toEqual("");
    });


    it("quality becomes 0 after the concert", () => {
      expect().toEqual("");
    });
  });
});



