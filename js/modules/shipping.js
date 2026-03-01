/**
 * MODULE: shipping.js
 * Shipping rate calculation.
 * 
 * In production: replace calcRates() with a real carrier API call
 * (EasyPost, ShipStation, Shippo, UPS/FedEx direct, etc.)
 * 
 * Current implementation: realistic flat-rate table by weight/zone.
 */

const Shipping = (() => {

  /**
   * Calculate shipping rates for a cart.
   * @param {Array} items       Cart items with { price, weight, qty }
   * @param {string} zip        Destination ZIP code
   * @returns {Promise<Array>}  Array of shipping option objects
   */
  async function calcRates(items, zip) {
    if (!zip || zip.length < 5) return [];

    const zone = estimateZone(zip);
    const totalWeight = items.reduce((t, i) => t + (i.weight || 1) * i.qty, 0); // lbs
    const totalValue  = items.reduce((t, i) => t + i.price * i.qty, 0);

    // Free shipping threshold
    const freeThreshold = 150;

    const rates = [
      {
        id: 'ground',
        name: 'Standard Ground',
        carrier: 'UPS / FedEx Ground',
        days: `${3 + zone}–${5 + zone} business days`,
        price: calcGroundRate(totalWeight, zone, totalValue >= freeThreshold),
        recommended: true,
      },
      {
        id: '3day',
        name: '3-Day Select',
        carrier: 'UPS 3-Day',
        days: '3 business days',
        price: calcExpressRate(totalWeight, zone, 3),
      },
      {
        id: '2day',
        name: '2-Day Air',
        carrier: 'UPS / FedEx 2Day',
        days: '2 business days',
        price: calcExpressRate(totalWeight, zone, 2),
      },
      {
        id: 'overnight',
        name: 'Overnight',
        carrier: 'UPS Next Day Air',
        days: 'Next business day',
        price: calcExpressRate(totalWeight, zone, 1),
      },
    ];

    return rates;
  }

  /** Rough zone estimation based on first 3 digits of ZIP */
  function estimateZone(zip) {
    const prefix = parseInt(zip.substring(0, 3));
    // Very rough US zone estimation (1=nearby, 4=far)
    if (prefix < 200) return 1;
    if (prefix < 400) return 2;
    if (prefix < 600) return 2;
    if (prefix < 800) return 3;
    return 4;
  }

  function calcGroundRate(lbs, zone, isFree) {
    if (isFree) return 0;
    const base = 8.99;
    const perLb = 0.85;
    const zoneAdj = zone * 1.20;
    return Math.max(base + (lbs * perLb) + zoneAdj, 9.99);
  }

  function calcExpressRate(lbs, zone, days) {
    const base = { 1: 45, 2: 28, 3: 19 }[days] || 19;
    const perLb = { 1: 3.5, 2: 2.5, 3: 1.8 }[days] || 1.8;
    const zoneAdj = zone * 2;
    return Math.max(base + (lbs * perLb) + zoneAdj, base);
  }

  /**
   * Calculate tax (simplified — use TaxJar/Avalara in production)
   * @param {number} subtotal   Order subtotal in dollars
   * @param {string} state      2-letter state abbreviation
   */
  function calcTax(subtotal, state) {
    const rates = {
      CA: 0.0725, TX: 0.0625, NY: 0.08, FL: 0.06,
      IL: 0.0625, PA: 0.06,  OH: 0.0575, GA: 0.04,
      // ... add more as needed, or use a real tax API
    };
    const rate = rates[state?.toUpperCase()] || 0.06; // default 6%
    return subtotal * rate;
  }

  function formatRate(rate) {
    return rate === 0 ? 'FREE' : `$${rate.toFixed(2)}`;
  }

  /** Extract state from ZIP (simplified) */
  function zipToState(zip) {
    const prefix = parseInt(zip.substring(0, 3));
    const map = [
      [[0,9],'MA'], [[10,99],'NY'], [[100,199],'NY'],
      [[200,239],'DC'], [[240,269],'VA'], [[270,289],'NC'],
      [[290,299],'SC'], [[300,319],'GA'], [[320,349],'FL'],
      [[350,369],'AL'], [[370,399],'TN'], [[400,427],'KY'],
      [[430,459],'OH'], [[460,479],'IN'], [[480,499],'MI'],
      [[500,528],'IA'], [[530,549],'WI'], [[550,567],'MN'],
      [[570,577],'SD'], [[580,588],'ND'], [[590,599],'MT'],
      [[600,629],'IL'], [[630,659],'MO'], [[660,679],'KS'],
      [[680,693],'NE'], [[700,714],'LA'], [[716,729],'AR'],
      [[730,749],'OK'], [[750,799],'TX'], [[800,816],'CO'],
      [[820,831],'WY'], [[832,838],'ID'], [[840,847],'UT'],
      [[850,865],'AZ'], [[870,884],'NM'], [[889,898],'NV'],
      [[900,966],'CA'], [[967,969],'HI'], [[970,979],'OR'],
      [[980,994],'WA'], [[995,999],'AK'],
    ];
    for (const [[lo, hi], state] of map) {
      if (prefix >= lo && prefix <= hi) return state;
    }
    return 'TX';
  }

  return { calcRates, calcTax, formatRate, zipToState, estimateZone };
})();

window.Shipping = Shipping;
