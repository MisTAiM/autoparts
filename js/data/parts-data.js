/**
 * PARTS DATA — AutoParts Warehouse v3
 * Includes: product images, fitment data, brake specs, vehicle compatibility
 * Images: Amazon CDN (stable product photography)
 * Fitment: Year/Make/Model/Engine/DriveType compatibility arrays
 */

const SAMPLE_PARTS = [
  {
    id: 1,
    name: 'Front Ceramic Brake Pad Set',
    brand: 'Wagner',
    partNumber: 'WGN-ZD1295',
    categoryId: 'brakes',
    categoryName: 'Brakes',
    condition: 'new',
    price: 38.99,
    coreCharge: 0,
    stockQty: 47,
    inStock: true,
    weight: 3.2,
    thumbnail: 'images/parts/71TG65RIMHL.jpg',
    description: 'Wagner QuickStop ceramic disc brake pad set. OE-matched friction formulations restore like-new braking performance. Includes stainless-steel hardware and lubricant. Zero-copper OE25 formulation. 100% post-cure process for even friction performance throughout pad life.',
    warrantyText: '3-Year / 36,000 Mile Warranty',
    tags: 'brake pads ceramic front wagner',
    specs: {
      'Friction Material': 'Ceramic',
      'Position': 'Front',
      'Caliper Type': 'Single Piston / Dual Piston',
      'Includes Hardware': 'Yes',
      'Dust Level': 'Low',
      'Noise Level': 'Ultra Quiet'
    },
    fitment: {
      yearStart: 2004, yearEnd: 2016,
      makes: ['Hyundai', 'Kia'],
      models: ['Tucson', 'Sportage', 'Santa Fe'],
      engines: ['2.0L', '2.4L', '2.7L'],
      driveTypes: ['FWD', 'AWD'],
      brakeCode: 'SP-HC',
      caliperPistons: 'Single Piston',
      notes: 'Front axle only. Verify VIN brake code before ordering.'
    }
  },
  {
    id: 2,
    name: 'Rear Brake Pad Set - OE Replacement',
    brand: 'Bosch',
    partNumber: 'BSH-BP921',
    categoryId: 'brakes',
    categoryName: 'Brakes',
    condition: 'new',
    price: 45.99,
    coreCharge: 0,
    stockQty: 32,
    inStock: true,
    weight: 2.8,
    thumbnail: 'images/parts/61CDZvLjumL.jpg',
    description: 'Bosch QuietCast premium disc brake pad set. European-engineered multi-layer shims for whisper-quiet operation. Chamfered and slotted for immediate, vibration-free braking. OE-matched friction for confidence-inspiring stops.',
    warrantyText: '2-Year / Unlimited Mileage Warranty',
    tags: 'brake pads rear bosch quietcast',
    specs: {
      'Friction Material': 'Semi-Metallic',
      'Position': 'Rear',
      'Caliper Type': 'Single Piston',
      'Shim Type': 'Multi-Layer',
      'Includes Hardware': 'Yes'
    },
    fitment: {
      yearStart: 2000, yearEnd: 2011,
      makes: ['Cadillac', 'Pontiac', 'Chevrolet'],
      models: ['DeVille', 'DTS', 'Grand Prix', 'Impala'],
      engines: ['3.8L', '4.6L', '5.3L'],
      driveTypes: ['FWD', 'RWD'],
      brakeCode: 'JB9',
      caliperPistons: 'Single Piston',
      notes: 'Rear axle. Check original caliper slide pin condition.'
    }
  },
  {
    id: 3,
    name: 'Drilled & Slotted Brake Rotor - Front',
    brand: 'Power Stop',
    partNumber: 'PWR-JBR1141XL',
    categoryId: 'brakes',
    categoryName: 'Brakes',
    condition: 'new',
    price: 62.49,
    coreCharge: 0,
    stockQty: 18,
    inStock: true,
    weight: 11.5,
    thumbnail: 'images/parts/81Rte2To22L.jpg',
    description: 'Power Stop Evolution Sport drilled and slotted performance brake rotor. Precision cross-drilled for improved cooling and reduced brake fade. Zinc dichromate plating resists rust. Vane design optimized for noise reduction.',
    warrantyText: '1-Year Manufacturer Warranty',
    tags: 'brake rotor drilled slotted performance front powerstop',
    specs: {
      'Type': 'Drilled & Slotted',
      'Position': 'Front Driver Side',
      'Material': 'G3000 Cast Iron',
      'Coating': 'Zinc Dichromate',
      'Diameter': '296mm',
      'Hat': 'Solid'
    },
    fitment: {
      yearStart: 2004, yearEnd: 2009,
      makes: ['Toyota'],
      models: ['Camry', 'RAV4', 'Highlander'],
      engines: ['2.4L', '3.3L', '3.5L'],
      driveTypes: ['FWD', 'AWD'],
      brakeCode: 'PB9',
      caliperPistons: 'Dual Piston',
      notes: 'Driver-side front rotor. Order qty 2 for complete axle. Requires Power Stop pads for best performance.'
    }
  },
  {
    id: 4,
    name: 'Alternator - Remanufactured 140A',
    brand: 'Remy',
    partNumber: 'RMY-94610',
    categoryId: 'electrical',
    categoryName: 'Electrical',
    condition: 'reman',
    price: 189.99,
    coreCharge: 30,
    stockQty: 9,
    inStock: true,
    weight: 14.2,
    thumbnail: 'images/parts/514SYGREqNL.jpg',
    description: 'Remy remanufactured alternator with 140-amp output. 100% new bearings, brushes, diodes and voltage regulators. Dynamometer tested to OE specifications. Designed to replenish charge faster on short trips.',
    warrantyText: '3-Year / Unlimited Mileage Warranty',
    tags: 'alternator remanufactured remy 140amp electrical charging',
    specs: {
      'Output': '140 Amps',
      'Voltage': '12V',
      'Condition': 'Remanufactured',
      'Pulley Type': 'Decoupler',
      'Regulator': 'Internal',
      'Tested': 'Dynamometer Tested'
    },
    fitment: {
      yearStart: 2007, yearEnd: 2013,
      makes: ['Chevrolet', 'GMC', 'Buick'],
      models: ['Silverado', 'Sierra', 'Tahoe', 'Suburban', 'Enclave'],
      engines: ['5.3L', '6.0L', '6.2L'],
      driveTypes: ['RWD', '4WD', 'AWD'],
      brakeCode: null,
      caliperPistons: null,
      notes: 'Core return required within 30 days. OEM output may differ by 10A.'
    }
  },
  {
    id: 5,
    name: 'Oil Filter - Extended Life',
    brand: 'Motorcraft',
    partNumber: 'MCF-FL400S',
    categoryId: 'engine',
    categoryName: 'Engine',
    condition: 'new',
    price: 12.99,
    coreCharge: 0,
    stockQty: 125,
    inStock: true,
    weight: 0.8,
    thumbnail: 'images/parts/71NPgNpXCUL.jpg',
    description: 'Motorcraft FL-400S Extended Performance oil filter. OEM quality filtration engineered for up to 10,000-mile oil change intervals with Full Synthetic oil. Features anti-drain-back valve and relief valve for cold-start protection.',
    warrantyText: 'OEM Quality Standard',
    tags: 'oil filter motorcraft extended life ford synthetic',
    specs: {
      'Thread Size': '3/4-16',
      'Height': '4.9"',
      'Diameter': '3.4"',
      'By-Pass Valve': '11 PSI',
      'Media': 'Synthetic Blend',
      'Anti-Drain Back': 'Yes'
    },
    fitment: {
      yearStart: 2000, yearEnd: 2023,
      makes: ['Ford', 'Lincoln', 'Mercury'],
      models: ['F-150', 'F-250', 'Explorer', 'Mustang', 'Expedition', 'Navigator', 'Town Car'],
      engines: ['4.2L', '4.6L', '5.0L', '5.4L', '6.2L'],
      driveTypes: ['RWD', '4WD', 'AWD'],
      brakeCode: null,
      caliperPistons: null,
      notes: 'Sold individually. Replace with every oil change — maximum every 10,000 miles with full synthetic.'
    }
  },
  {
    id: 6,
    name: 'Air Filter - High Flow Performance',
    brand: 'K&N',
    partNumber: 'KN-33-2304',
    categoryId: 'engine',
    categoryName: 'Engine',
    condition: 'new',
    price: 54.99,
    coreCharge: 0,
    stockQty: 38,
    inStock: true,
    weight: 0.6,
    thumbnail: 'images/parts/33-2304.jpg',
    description: 'K&N High-Performance replacement air filter. Washable and reusable — guaranteed for 1 million miles. Cotton gauze construction provides superior airflow vs. paper filters. Direct drop-in replacement requiring no modification.',
    warrantyText: 'Million Mile Limited Warranty',
    tags: 'air filter kn performance reusable washable high flow',
    specs: {
      'Media': 'Oiled Cotton Gauze',
      'Type': 'Drop-In Replacement',
      'Washable': 'Yes',
      'Airflow Improvement': 'Up to 15% vs. Stock',
      'Shape': 'Panel',
      'Certification': 'CARB EO D-670-3'
    },
    fitment: {
      yearStart: 2002, yearEnd: 2008,
      makes: ['Toyota'],
      models: ['Corolla', 'Matrix'],
      engines: ['1.8L'],
      driveTypes: ['FWD', 'AWD'],
      brakeCode: null,
      caliperPistons: null,
      notes: 'Replace every 50,000 miles (normal) or 75,000 miles (synthetic oil). Re-oil with K&N filter oil after every cleaning.'
    }
  },
  {
    id: 7,
    name: 'Water Pump - OE Replacement with Gasket',
    brand: 'Gates',
    partNumber: 'GAT-41047',
    categoryId: 'cooling',
    categoryName: 'Cooling',
    condition: 'new',
    price: 78.49,
    coreCharge: 0,
    stockQty: 14,
    inStock: true,
    weight: 4.1,
    thumbnail: 'images/parts/71rQFr0j2NL.jpg',
    description: 'Gates OE-replacement water pump with gasket. Cast iron/aluminum construction for OE-quality performance. 100% factory-tested for pressure and flow rates. Engineered for easy installation with full hardware kit included.',
    warrantyText: '3-Year / 36,000 Mile Warranty',
    tags: 'water pump gates cooling engine coolant replacement',
    specs: {
      'Includes': 'Pump + Gasket',
      'Material': 'Cast Iron / Aluminum',
      'Impeller': 'Metal Stamped',
      'Seal Type': 'Mechanical',
      'Tested': 'Factory Pressure Tested',
      'Drive': 'Belt Driven'
    },
    fitment: {
      yearStart: 2001, yearEnd: 2009,
      makes: ['Toyota'],
      models: ['Camry', 'Solara', 'Highlander', 'RAV4', 'Sienna'],
      engines: ['2.4L'],
      driveTypes: ['FWD', 'AWD'],
      brakeCode: null,
      caliperPistons: null,
      notes: 'Change timing belt and serpentine belt simultaneously. Always use new coolant when replacing water pump.'
    }
  },
  {
    id: 8,
    name: 'Radiator Hose Kit - Upper and Lower',
    brand: 'Dayco',
    partNumber: 'DAY-71813K',
    categoryId: 'cooling',
    categoryName: 'Cooling',
    condition: 'new',
    price: 29.99,
    coreCharge: 0,
    stockQty: 23,
    inStock: true,
    weight: 1.4,
    thumbnail: 'images/parts/61eTmiqvnUL.jpg',
    description: 'Dayco complete radiator hose kit including upper and lower hoses. Premium EPDM construction for maximum heat and chemical resistance. Reinforced with woven polyester for burst pressure up to 85 PSI. Direct-fit replacement, no trimming required.',
    warrantyText: '2-Year / 24,000 Mile Warranty',
    tags: 'radiator hose kit dayco cooling upper lower epdm',
    specs: {
      'Material': 'EPDM Rubber',
      'Reinforcement': 'Woven Polyester',
      'Burst Pressure': '85 PSI',
      'Temperature Range': '-40°F to 280°F',
      'Includes': 'Upper + Lower Hose',
      'Clamps': 'Not Included'
    },
    fitment: {
      yearStart: 1999, yearEnd: 2004,
      makes: ['Jeep'],
      models: ['Grand Cherokee'],
      engines: ['4.0L', '4.7L'],
      driveTypes: ['RWD', '4WD'],
      brakeCode: null,
      caliperPistons: null,
      notes: 'Install both hoses simultaneously. Flush and replace coolant. Inspect thermostat housing and clamps.'
    }
  },
  {
    id: 9,
    name: 'Starter Motor - Remanufactured',
    brand: 'Remy',
    partNumber: 'RMY-17466',
    categoryId: 'electrical',
    categoryName: 'Electrical',
    condition: 'reman',
    price: 134.99,
    coreCharge: 25,
    stockQty: 7,
    inStock: true,
    weight: 9.3,
    thumbnail: 'images/parts/61-ITupeTbL.jpg',
    description: 'Remy remanufactured starter motor. 100% new solenoid contacts, brushes, drive assemblies and bearings. Hi-pot and load testing ensures proper operation. Meets or exceeds OE specifications for cranking amps and torque.',
    warrantyText: '3-Year / Unlimited Mileage Warranty',
    tags: 'starter motor remanufactured remy electrical cranking',
    specs: {
      'Condition': 'Remanufactured',
      'Type': 'Permanent Magnet Gear Reduction',
      'Voltage': '12V',
      'Tooth Count': '9',
      'Tested': 'Hi-Pot + Load Tested',
      'Included': 'Mounting Hardware'
    },
    fitment: {
      yearStart: 1997, yearEnd: 2003,
      makes: ['Ford', 'Mercury'],
      models: ['F-150', 'Expedition', 'Navigator', 'Mountaineer'],
      engines: ['4.6L', '5.4L'],
      driveTypes: ['RWD', '4WD'],
      brakeCode: null,
      caliperPistons: null,
      notes: 'Core return required. Check flywheel ring gear for wear before installing new starter.'
    }
  },
  {
    id: 10,
    name: 'Shock Absorber - Front Gas-Charged',
    brand: 'Monroe',
    partNumber: 'MON-71643',
    categoryId: 'suspension',
    categoryName: 'Suspension',
    condition: 'new',
    price: 52.49,
    coreCharge: 0,
    stockQty: 28,
    inStock: true,
    weight: 5.6,
    thumbnail: 'images/parts/41MQ7vwss7L.jpg',
    description: 'Monroe OESpectrum front shock absorber with Sensatrac technology. Self-adjusting variable control provides optimal handling at all speeds. Precision-built to OEM dimensions for guaranteed fit. Gas-charged for performance-grade control.',
    warrantyText: '3-Year / 36,000 Mile Warranty',
    tags: 'shock absorber monroe front suspension gas charged sensatrac',
    specs: {
      'Type': 'Gas-Charged Monotube',
      'Position': 'Front',
      'Technology': 'Sensatrac Variable Control',
      'Piston': '46mm',
      'Rebound Valve': 'Progressive',
      'Coating': 'Zinc Phosphate'
    },
    fitment: {
      yearStart: 2004, yearEnd: 2008,
      makes: ['Toyota'],
      models: ['Solara', 'Camry'],
      engines: ['2.4L', '3.3L'],
      driveTypes: ['FWD'],
      brakeCode: null,
      caliperPistons: null,
      notes: 'Replace in pairs (left and right). Inspect upper mount and dust boot. Sold individually.'
    }
  },
  {
    id: 11,
    name: 'Catalytic Converter - Direct Fit',
    brand: 'MagnaFlow',
    partNumber: 'MGF-23295',
    categoryId: 'exhaust',
    categoryName: 'Exhaust',
    condition: 'new',
    price: 299.99,
    coreCharge: 0,
    stockQty: 5,
    inStock: true,
    weight: 8.2,
    thumbnail: 'images/parts/61TQIV8p-6L.jpg',
    description: 'MagnaFlow direct-fit OEM-grade catalytic converter. Meets or exceeds EPA and California CARB emission standards. High-cell density substrate for maximum catalyst contact. Stainless steel body with OEM-style flange for leak-free fitment.',
    warrantyText: '5-Year / 50,000 Mile Federal Emissions Warranty',
    tags: 'catalytic converter magnaflow exhaust emissions direct fit epa carb',
    specs: {
      'Type': 'Direct Fit',
      'Cell Density': '400 CPSI',
      'Body Material': '409 Stainless Steel',
      'Substrate': 'Cordierite',
      'Compliant': 'EPA + CARB',
      'Position': 'Front Converter'
    },
    fitment: {
      yearStart: 2004, yearEnd: 2008,
      makes: ['Ford'],
      models: ['F-150'],
      engines: ['5.4L'],
      driveTypes: ['RWD', '4WD'],
      brakeCode: null,
      caliperPistons: null,
      notes: 'Driver-side front converter. Check for exhaust leaks upstream before installing. Always replace oxygen sensors when replacing converter.'
    }
  },
  {
    id: 12,
    name: 'Fuel Pump Module Assembly',
    brand: 'Delphi',
    partNumber: 'DEL-FG0166',
    categoryId: 'fuel',
    categoryName: 'Fuel System',
    condition: 'new',
    price: 189.99,
    coreCharge: 0,
    stockQty: 11,
    inStock: true,
    weight: 3.5,
    thumbnail: 'images/parts/61KyRRCDDyL.jpg',
    description: 'Delphi fuel pump module assembly. Complete drop-in replacement includes pump, float assembly, strainer, and all gaskets. Engineered to meet or exceed OE fuel pressure and flow. Quiet operation, extended service life. OEM supplier to major manufacturers.',
    warrantyText: '3-Year / 36,000 Mile Warranty',
    tags: 'fuel pump module assembly delphi fuel system replacement',
    specs: {
      'Includes': 'Pump + Float + Strainer + Gasket',
      'Pressure': 'OE-Spec',
      'Flow Rate': 'OE-Spec',
      'Voltage': '12V',
      'Strainer': 'Included',
      'OEM Supplier': 'Yes'
    },
    fitment: {
      yearStart: 2003, yearEnd: 2007,
      makes: ['Honda'],
      models: ['Accord', 'Element'],
      engines: ['2.4L'],
      driveTypes: ['FWD', 'AWD'],
      brakeCode: null,
      caliperPistons: null,
      notes: 'Always replace with engine off and fuel pressure released. Replace strainer simultaneously. Inspect sending unit float before install.'
    }
  }
];

window.SAMPLE_PARTS = SAMPLE_PARTS;

// ─── EXPANDED CATALOG — IDs 13–48 ────────────────────────────────────────────
SAMPLE_PARTS.push(

  // ── BRAKES ─────────────────────────────────────────────────────────────────
  {
    id: 13, name: 'Brake Master Cylinder - OEM Style', brand: 'Dorman', partNumber: 'DRM-M630404',
    categoryId: 'brakes', categoryName: 'Brakes', condition: 'new', price: 54.99, coreCharge: 0, stockQty: 18, inStock: true, weight: 2.1,
    thumbnail: 'images/parts/unsplash-1486262715619.jpg',
    description: 'Direct-fit replacement brake master cylinder. Manufactured to OEM specifications for reliable braking performance.',
    warrantyText: '1-Year Warranty', tags: 'brake master cylinder dorman',
    specs: { 'Type': 'OEM Replacement', 'Reservoir': 'Integrated', 'Bore Diameter': '22.2mm', 'Ports': '2' },
    fitment: { yearStart: 2006, yearEnd: 2011, makes: ['Honda'], models: ['Civic', 'CR-V'], engines: ['1.8L', '2.0L', '2.4L'], driveTypes: ['FWD', 'AWD'] }
  },
  {
    id: 14, name: 'Brake Caliper - Front Right Remanufactured', brand: 'Cardone', partNumber: 'CRD-18-B5451',
    categoryId: 'brakes', categoryName: 'Brakes', condition: 'reman', price: 44.99, coreCharge: 25.00, stockQty: 12, inStock: true, weight: 4.5,
    thumbnail: 'images/parts/unsplash-1621252179027.jpg',
    description: 'Remanufactured front right brake caliper. Fully disassembled, cleaned, inspected and rebuilt with new seals and hardware.',
    warrantyText: '18-Month Warranty', tags: 'brake caliper front right cardone reman',
    specs: { 'Position': 'Front Right', 'Pistons': '1', 'Piston Material': 'Phenolic', 'Bleeder Screw': 'New' },
    fitment: { yearStart: 2009, yearEnd: 2014, makes: ['Toyota'], models: ['Camry', 'RAV4'], engines: ['2.5L', '3.5L'], driveTypes: ['FWD', 'AWD'] }
  },
  {
    id: 15, name: 'Brake Rotor - Rear Solid', brand: 'ACDelco', partNumber: 'ACD-18A81',
    categoryId: 'brakes', categoryName: 'Brakes', condition: 'new', price: 28.99, coreCharge: 0, stockQty: 34, inStock: true, weight: 5.2,
    thumbnail: 'images/parts/unsplash-1609220136736.jpg',
    description: 'ACDelco Professional rear brake rotor. Premium grey iron casting with corrosion protection.',
    warrantyText: '3-Year Warranty', tags: 'brake rotor rear solid acdelco',
    specs: { 'Position': 'Rear', 'Type': 'Solid', 'Finish': 'Coated', 'Diameter': '292mm' },
    fitment: { yearStart: 2014, yearEnd: 2019, makes: ['Chevrolet', 'GMC'], models: ['Silverado', 'Sierra'], engines: ['4.3L', '5.3L', '6.2L'], driveTypes: ['RWD', '4WD'] }
  },

  // ── ENGINE ─────────────────────────────────────────────────────────────────
  {
    id: 16, name: 'Spark Plug Set - Iridium Long Life', brand: 'NGK', partNumber: 'NGK-ILTR5A13',
    categoryId: 'engine', categoryName: 'Engine', condition: 'new', price: 42.99, coreCharge: 0, stockQty: 65, inStock: true, weight: 0.8,
    thumbnail: 'images/parts/unsplash-1502877338535.jpg',
    description: 'NGK Iridium Long Life spark plugs. Superior ignitability and extended service life up to 100,000 miles.',
    warrantyText: '2-Year Warranty', tags: 'spark plugs iridium ngk long life',
    specs: { 'Material': 'Iridium', 'Gap': '1.0mm Pre-Set', 'Heat Range': '5', 'Service Life': '100,000 miles' },
    fitment: { yearStart: 2010, yearEnd: 2020, makes: ['Toyota', 'Lexus'], models: ['Camry', 'Corolla', 'ES350', 'IS250'], engines: ['2.5L', '3.5L', '2.5L I4'], driveTypes: ['FWD', 'RWD', 'AWD'] }
  },
  {
    id: 17, name: 'Timing Belt Kit with Water Pump', brand: 'Gates', partNumber: 'GAT-TCKWP242',
    categoryId: 'engine', categoryName: 'Engine', condition: 'new', price: 94.99, coreCharge: 0, stockQty: 22, inStock: true, weight: 3.4,
    thumbnail: 'images/parts/unsplash-1486262715619.jpg',
    description: 'Complete timing belt kit includes timing belt, water pump, tensioner, and idler pulleys. Replace all components simultaneously.',
    warrantyText: '5-Year / 100,000 Mile Warranty', tags: 'timing belt kit water pump gates',
    specs: { 'Includes': 'Belt, Water Pump, Tensioner, Idlers', 'Material': 'HNBR Rubber', 'Interval': '105,000 miles', 'OE Equivalent': 'Yes' },
    fitment: { yearStart: 2003, yearEnd: 2012, makes: ['Honda', 'Acura'], models: ['Odyssey', 'Pilot', 'MDX', 'Accord V6'], engines: ['3.0L', '3.5L'], driveTypes: ['FWD', 'AWD'] }
  },
  {
    id: 18, name: 'Valve Cover Gasket Set', brand: 'Fel-Pro', partNumber: 'FEL-VS50596R',
    categoryId: 'engine', categoryName: 'Engine', condition: 'new', price: 22.99, coreCharge: 0, stockQty: 41, inStock: true, weight: 0.6,
    thumbnail: 'images/parts/unsplash-1621252179027.jpg',
    description: 'Fel-Pro valve cover gasket set with carrier-mounted seals. Prevents oil leaks from the top end of the engine.',
    warrantyText: 'Lifetime Warranty', tags: 'valve cover gasket set fel-pro',
    specs: { 'Material': 'Molded Rubber', 'OEM Quality': 'Yes', 'Carrier': 'Integrated', 'Seals Included': 'Yes' },
    fitment: { yearStart: 2001, yearEnd: 2008, makes: ['Toyota'], models: ['Tacoma', 'Tundra', '4Runner'], engines: ['3.4L V6'], driveTypes: ['RWD', '4WD'] }
  },
  {
    id: 19, name: 'Oil Pan Gasket', brand: 'Fel-Pro', partNumber: 'FEL-OS30671R',
    categoryId: 'engine', categoryName: 'Engine', condition: 'new', price: 16.49, coreCharge: 0, stockQty: 53, inStock: true, weight: 0.3,
    thumbnail: 'images/parts/unsplash-1609220136736.jpg',
    description: 'Premium oil pan gasket. Carrier-mounted embossed steel core with molded rubber sealing beads.',
    warrantyText: 'Lifetime Warranty', tags: 'oil pan gasket engine seal',
    specs: { 'Material': 'Molded Rubber', 'Core': 'Embossed Steel', 'Sealing Beads': 'Yes', 'Installation': 'No Sealant Required' },
    fitment: { yearStart: 2005, yearEnd: 2015, makes: ['Ford'], models: ['Mustang', 'F-150', 'Explorer'], engines: ['4.6L', '5.4L', '3.7L'], driveTypes: ['RWD', 'AWD', '4WD'] }
  },

  // ── SUSPENSION ─────────────────────────────────────────────────────────────
  {
    id: 20, name: 'Strut Assembly - Front Complete', brand: 'Monroe', partNumber: 'MON-181455',
    categoryId: 'suspension', categoryName: 'Suspension', condition: 'new', price: 89.99, coreCharge: 0, stockQty: 14, inStock: true, weight: 9.8,
    thumbnail: 'images/parts/unsplash-1502877338535.jpg',
    description: 'Monroe Quick-Strut complete strut assembly. Pre-assembled with spring, mount, and bumper for fast installation.',
    warrantyText: '3-Year / 36,000 Mile Warranty', tags: 'strut assembly front complete monroe quick-strut',
    specs: { 'Type': 'Complete Assembly', 'Spring Included': 'Yes', 'Mount Included': 'Yes', 'Bumper Included': 'Yes' },
    fitment: { yearStart: 2012, yearEnd: 2017, makes: ['Honda'], models: ['CR-V', 'Civic'], engines: ['1.5T', '2.0L', '2.4L'], driveTypes: ['FWD', 'AWD'] }
  },
  {
    id: 21, name: 'Control Arm - Lower Front with Ball Joint', brand: 'Moog', partNumber: 'MOG-RK620362',
    categoryId: 'suspension', categoryName: 'Suspension', condition: 'new', price: 67.49, coreCharge: 0, stockQty: 19, inStock: true, weight: 4.2,
    thumbnail: 'images/parts/unsplash-1486262715619.jpg',
    description: 'Moog Problem Solver lower control arm with pre-installed ball joint. Enhanced design exceeds OE specs.',
    warrantyText: 'Lifetime Warranty', tags: 'control arm lower ball joint moog problem solver',
    specs: { 'Ball Joint': 'Pre-Installed', 'Bushing': 'Pre-Installed', 'Material': 'High-Strength Steel', 'Grease Fittings': 'Yes' },
    fitment: { yearStart: 2008, yearEnd: 2013, makes: ['Chevrolet', 'GMC'], models: ['Malibu', 'Impala', 'Lacrosse'], engines: ['2.4L', '3.0L', '3.6L'], driveTypes: ['FWD'] }
  },
  {
    id: 22, name: 'Sway Bar End Link Kit - Front', brand: 'Moog', partNumber: 'MOG-K750157',
    categoryId: 'suspension', categoryName: 'Suspension', condition: 'new', price: 24.99, coreCharge: 0, stockQty: 38, inStock: true, weight: 1.1,
    thumbnail: 'images/parts/unsplash-1621252179027.jpg',
    description: 'Premium sway bar end link kit. Eliminates clunking and improves handling. Comes as a pair.',
    warrantyText: 'Lifetime Warranty', tags: 'sway bar end link front moog pair',
    specs: { 'Quantity': 'Pair', 'Material': 'Heavy-Duty Steel', 'Greaseable': 'Yes', 'Position': 'Front' },
    fitment: { yearStart: 2005, yearEnd: 2016, makes: ['Toyota'], models: ['Tacoma', '4Runner', 'FJ Cruiser'], engines: ['2.7L', '4.0L'], driveTypes: ['RWD', '4WD'] }
  },
  {
    id: 23, name: 'Rear Shock Absorber - OEM Style', brand: 'KYB', partNumber: 'KYB-349088',
    categoryId: 'suspension', categoryName: 'Suspension', condition: 'new', price: 34.99, coreCharge: 0, stockQty: 27, inStock: true, weight: 3.1,
    thumbnail: 'images/parts/unsplash-1609220136736.jpg',
    description: 'KYB Excel-G rear shock absorber. Restores OE ride and handling comfort. Twin-tube design.',
    warrantyText: '1-Year Warranty', tags: 'rear shock absorber kyb excel-g oem',
    specs: { 'Type': 'Gas-Charged Twin-Tube', 'Position': 'Rear', 'Stroke': 'OE Length', 'Mount': 'Direct Replacement' },
    fitment: { yearStart: 2009, yearEnd: 2018, makes: ['Ford'], models: ['F-150'], engines: ['3.5L', '5.0L', '2.7T', '3.5T'], driveTypes: ['RWD', '4WD'] }
  },

  // ── ELECTRICAL ─────────────────────────────────────────────────────────────
  {
    id: 24, name: 'Battery - AGM Group 48', brand: 'Optima', partNumber: 'OPT-8022-091',
    categoryId: 'electrical', categoryName: 'Electrical', condition: 'new', price: 219.99, coreCharge: 18.00, stockQty: 8, inStock: true, weight: 26.0,
    thumbnail: 'images/parts/unsplash-1502877338535.jpg',
    description: 'Optima YellowTop AGM battery. Deep-cycle and starting power in one. Ideal for vehicles with accessories.',
    warrantyText: '3-Year Free Replacement', tags: 'battery agm optima yellowtop group 48',
    specs: { 'Type': 'AGM Dual-Purpose', 'CCA': '750', 'Reserve Capacity': '120 min', 'Voltage': '12V' },
    fitment: { yearStart: 2010, yearEnd: 2023, makes: ['Universal'], models: ['Multiple'], engines: ['All'], driveTypes: ['All'] }
  },
  {
    id: 25, name: 'Ignition Coil Pack', brand: 'Delphi', partNumber: 'DEL-GN10328',
    categoryId: 'electrical', categoryName: 'Electrical', condition: 'new', price: 31.99, coreCharge: 0, stockQty: 29, inStock: true, weight: 0.9,
    thumbnail: 'images/parts/unsplash-1486262715619.jpg',
    description: 'Delphi ignition coil. OE-equivalent spark energy for reliable cold starts and fuel efficiency.',
    warrantyText: '2-Year Warranty', tags: 'ignition coil pack delphi',
    specs: { 'Type': 'Coil-on-Plug', 'Peak Voltage': '40,000V', 'Connector': 'OEM Match', 'Temperature Range': '-40°F to 248°F' },
    fitment: { yearStart: 2007, yearEnd: 2015, makes: ['Chevrolet', 'GMC'], models: ['Silverado', 'Sierra', 'Equinox', 'Traverse'], engines: ['4.8L', '5.3L', '6.0L', '6.2L'], driveTypes: ['RWD', '4WD', 'AWD'] }
  },
  {
    id: 26, name: 'Headlight Assembly - Driver Side', brand: 'TYC', partNumber: 'TYC-20-9366-00',
    categoryId: 'electrical', categoryName: 'Electrical', condition: 'new', price: 78.99, coreCharge: 0, stockQty: 11, inStock: true, weight: 4.8,
    thumbnail: 'images/parts/unsplash-1621252179027.jpg',
    description: 'TYC replacement headlight assembly. DOT/SAE certified. Direct bolt-on replacement with original equipment connectors.',
    warrantyText: '1-Year Warranty', tags: 'headlight assembly driver side TYC',
    specs: { 'Side': 'Driver (Left)', 'Bulb Type': 'H11/H9', 'DOT/SAE': 'Certified', 'Connector': 'OEM Match' },
    fitment: { yearStart: 2014, yearEnd: 2016, makes: ['Toyota'], models: ['Corolla'], engines: ['1.8L'], driveTypes: ['FWD'] }
  },

  // ── COOLING ────────────────────────────────────────────────────────────────
  {
    id: 27, name: 'Radiator - Direct Fit Aluminum', brand: 'Spectra Premium', partNumber: 'SPC-CU2779',
    categoryId: 'cooling', categoryName: 'Cooling', condition: 'new', price: 124.99, coreCharge: 0, stockQty: 9, inStock: true, weight: 11.2,
    thumbnail: 'images/parts/unsplash-1609220136736.jpg',
    description: 'Spectra Premium aluminum radiator. OE-equivalent cooling capacity with improved heat dissipation.',
    warrantyText: '3-Year Warranty', tags: 'radiator aluminum direct fit spectra',
    specs: { 'Core Material': 'Aluminum', 'Tank Material': 'Plastic', 'Rows': '1', 'Trans Cooler': 'Integrated' },
    fitment: { yearStart: 2013, yearEnd: 2017, makes: ['Honda'], models: ['Accord'], engines: ['2.4L', '3.5L', '2.4T'], driveTypes: ['FWD', 'AWD'] }
  },
  {
    id: 28, name: 'Coolant Thermostat with Housing', brand: 'Gates', partNumber: 'GAT-CO34935',
    categoryId: 'cooling', categoryName: 'Cooling', condition: 'new', price: 29.49, coreCharge: 0, stockQty: 33, inStock: true, weight: 0.7,
    thumbnail: 'images/parts/unsplash-1502877338535.jpg',
    description: 'Gates thermostat with integrated housing. Eliminates leaks at the housing sealing surface.',
    warrantyText: '1-Year Warranty', tags: 'thermostat housing coolant gates',
    specs: { 'Opening Temp': '195°F / 91°C', 'Type': 'With Housing', 'Gasket': 'Included', 'Material': 'OE Grade' },
    fitment: { yearStart: 2008, yearEnd: 2017, makes: ['Ford'], models: ['Focus', 'Fusion', 'Escape', 'C-Max'], engines: ['2.0L', '1.6T', '2.0T'], driveTypes: ['FWD', 'AWD'] }
  },
  {
    id: 29, name: 'Electric Cooling Fan Assembly', brand: 'Dorman', partNumber: 'DRM-621-536',
    categoryId: 'cooling', categoryName: 'Cooling', condition: 'new', price: 87.99, coreCharge: 0, stockQty: 7, inStock: true, weight: 5.6,
    thumbnail: 'images/parts/unsplash-1486262715619.jpg',
    description: 'Direct-fit electric cooling fan module with motor. Drop-in replacement with OE connectors.',
    warrantyText: '2-Year Warranty', tags: 'cooling fan electric assembly dorman',
    specs: { 'Motor': 'Included', 'Connector': 'OEM Plug', 'Blade Material': 'Nylon', 'CFM Rating': 'OE Equivalent' },
    fitment: { yearStart: 2009, yearEnd: 2014, makes: ['Nissan', 'Infiniti'], models: ['Altima', 'Maxima', 'G37'], engines: ['2.5L', '3.5L'], driveTypes: ['FWD', 'RWD', 'AWD'] }
  },

  // ── FILTERS ────────────────────────────────────────────────────────────────
  {
    id: 30, name: 'Cabin Air Filter - Activated Carbon', brand: 'FRAM', partNumber: 'FRM-CF12060',
    categoryId: 'filters', categoryName: 'Filters', condition: 'new', price: 19.99, coreCharge: 0, stockQty: 72, inStock: true, weight: 0.4,
    thumbnail: 'images/parts/unsplash-1621252179027.jpg',
    description: 'FRAM Fresh Breeze cabin air filter with activated carbon. Eliminates odors and captures 99% of particles.',
    warrantyText: '1-Year Warranty', tags: 'cabin air filter carbon odor fram',
    specs: { 'Type': 'Activated Carbon', 'Particle Filtration': '99%', 'Odor Reduction': 'Yes', 'Replacement Interval': '15,000 miles' },
    fitment: { yearStart: 2016, yearEnd: 2022, makes: ['Toyota'], models: ['Camry', 'RAV4', 'Highlander', 'Prius'], engines: ['All'], driveTypes: ['FWD', 'AWD'] }
  },
  {
    id: 31, name: 'Fuel Filter - In-Line', brand: 'Wix', partNumber: 'WIX-33029',
    categoryId: 'filters', categoryName: 'Filters', condition: 'new', price: 11.99, coreCharge: 0, stockQty: 88, inStock: true, weight: 0.5,
    thumbnail: 'images/parts/unsplash-1609220136736.jpg',
    description: 'Wix in-line fuel filter. High-efficiency filtration media removes contaminants to protect fuel injectors.',
    warrantyText: 'Lifetime Warranty', tags: 'fuel filter inline wix',
    specs: { 'Filtration Media': 'Cellulose', 'Pressure Rating': '90 PSI', 'Flow Rate': 'OE Match', 'Micron Rating': '10µ' },
    fitment: { yearStart: 1998, yearEnd: 2011, makes: ['Ford'], models: ['F-150', 'Expedition', 'Mustang'], engines: ['4.6L', '5.4L', '4.0L'], driveTypes: ['RWD', '4WD'] }
  },
  {
    id: 32, name: 'Transmission Filter Kit', brand: 'ACDelco', partNumber: 'ACD-TF334',
    categoryId: 'filters', categoryName: 'Filters', condition: 'new', price: 24.49, coreCharge: 0, stockQty: 31, inStock: true, weight: 0.9,
    thumbnail: 'images/parts/unsplash-1502877338535.jpg',
    description: 'ACDelco Professional transmission filter kit. Includes filter and pan gasket for complete service.',
    warrantyText: '2-Year Warranty', tags: 'transmission filter kit acdelco automatic',
    specs: { 'Includes': 'Filter + Pan Gasket', 'Fluid Type': 'Dexron VI', 'Interval': '30,000 miles', 'OEM Spec': 'Yes' },
    fitment: { yearStart: 2010, yearEnd: 2019, makes: ['Chevrolet', 'GMC', 'Cadillac'], models: ['Multiple'], engines: ['All'], driveTypes: ['FWD', 'RWD', 'AWD', '4WD'] }
  },

  // ── DRIVETRAIN ─────────────────────────────────────────────────────────────
  {
    id: 33, name: 'CV Axle Shaft - Front Driver Side', brand: 'GSP', partNumber: 'GSP-NCV73571',
    categoryId: 'drivetrain', categoryName: 'Drivetrain', condition: 'new', price: 64.99, coreCharge: 0, stockQty: 16, inStock: true, weight: 6.8,
    thumbnail: 'images/parts/unsplash-1486262715619.jpg',
    description: 'GSP complete CV axle shaft. Direct replacement with OE-spec joints and boot kit. No core charge.',
    warrantyText: '1-Year Warranty', tags: 'cv axle shaft front driver gsp',
    specs: { 'Position': 'Front Left (Driver)', 'Joints': 'Both Ends New', 'Boot Material': 'Thermoplastic', 'Grease': 'Pre-Packed' },
    fitment: { yearStart: 2013, yearEnd: 2020, makes: ['Nissan'], models: ['Altima', 'Pathfinder', 'Murano'], engines: ['2.5L', '3.5L'], driveTypes: ['FWD', 'AWD'] }
  },
  {
    id: 34, name: 'Differential Fluid - 75W-90 GL-5', brand: 'Mobil 1', partNumber: 'MOB-75W90-QT',
    categoryId: 'drivetrain', categoryName: 'Drivetrain', condition: 'new', price: 14.99, coreCharge: 0, stockQty: 110, inStock: true, weight: 2.1,
    thumbnail: 'images/parts/unsplash-1621252179027.jpg',
    description: 'Mobil 1 Synthetic Gear Lube. Full synthetic formula for maximum protection in front and rear differentials.',
    warrantyText: 'N/A', tags: 'differential fluid gear oil 75w-90 mobil 1 synthetic',
    specs: { 'Viscosity': '75W-90', 'Classification': 'GL-5', 'Quantity': '1 Quart', 'Type': 'Full Synthetic' },
    fitment: { yearStart: 1990, yearEnd: 2023, makes: ['Universal'], models: ['Multiple'], engines: ['All'], driveTypes: ['RWD', 'AWD', '4WD'] }
  },
  {
    id: 35, name: 'Transfer Case Motor', brand: 'Dorman', partNumber: 'DRM-600-803',
    categoryId: 'drivetrain', categoryName: 'Drivetrain', condition: 'new', price: 89.99, coreCharge: 0, stockQty: 6, inStock: true, weight: 3.3,
    thumbnail: 'images/parts/unsplash-1609220136736.jpg',
    description: 'Dorman transfer case motor. Restores proper 4WD engagement. Direct plug-in replacement.',
    warrantyText: '2-Year Warranty', tags: 'transfer case motor 4wd engagement dorman',
    specs: { 'Voltage': '12V', 'Connector': 'OEM Match', 'Actuator Type': 'Electronic', 'Position Sensor': 'Integrated' },
    fitment: { yearStart: 2002, yearEnd: 2009, makes: ['Ford'], models: ['Explorer', 'Mountaineer', 'Sport Trac'], engines: ['4.0L', '4.6L'], driveTypes: ['4WD', 'AWD'] }
  },

  // ── EXHAUST ────────────────────────────────────────────────────────────────
  {
    id: 36, name: 'Performance Exhaust Header - 4-into-1', brand: 'BBK Performance', partNumber: 'BBK-1525',
    categoryId: 'exhaust', categoryName: 'Exhaust', condition: 'new', price: 289.99, coreCharge: 0, stockQty: 4, inStock: true, weight: 18.4,
    thumbnail: 'images/parts/unsplash-1502877338535.jpg',
    description: 'BBK Performance shorty headers. Mandrel-bent 1-5/8" primary tubes. Up to 15 HP gain over stock manifolds.',
    warrantyText: '1-Year Warranty', tags: 'exhaust header shorty bbk performance mustang',
    specs: { 'Tube Diameter': '1-5/8"', 'Material': '409 Stainless Steel', 'Bend Type': 'Mandrel', 'Expected Gain': '10-15 HP' },
    fitment: { yearStart: 2011, yearEnd: 2014, makes: ['Ford'], models: ['Mustang'], engines: ['5.0L V8'], driveTypes: ['RWD'] }
  },
  {
    id: 37, name: 'Muffler - Direct Fit OEM Style', brand: 'Walker', partNumber: 'WAL-21591',
    categoryId: 'exhaust', categoryName: 'Exhaust', condition: 'new', price: 78.99, coreCharge: 0, stockQty: 13, inStock: true, weight: 8.7,
    thumbnail: 'images/parts/unsplash-1486262715619.jpg',
    description: 'Walker Ultra muffler. Meets or exceeds original equipment specifications for sound attenuation.',
    warrantyText: '2-Year / Rust Perforation', tags: 'muffler direct fit oem walker',
    specs: { 'Inlet': '2.25"', 'Outlet': '2.25"', 'Material': 'Aluminized Steel', 'Type': 'Reverse Flow' },
    fitment: { yearStart: 2007, yearEnd: 2013, makes: ['Toyota'], models: ['Camry'], engines: ['2.4L', '2.5L', '3.5L'], driveTypes: ['FWD', 'AWD'] }
  },
  {
    id: 38, name: 'Oxygen Sensor - Downstream', brand: 'Bosch', partNumber: 'BSH-13474',
    categoryId: 'exhaust', categoryName: 'Exhaust', condition: 'new', price: 34.99, coreCharge: 0, stockQty: 44, inStock: true, weight: 0.4,
    thumbnail: 'images/parts/unsplash-1621252179027.jpg',
    description: 'Bosch downstream oxygen sensor. OE design with direct-fit connector. Eliminates check engine light.',
    warrantyText: 'Lifetime Warranty', tags: 'oxygen sensor downstream o2 bosch',
    specs: { 'Position': 'Downstream (Post-Cat)', 'Wires': '4', 'Response Time': '<5 seconds', 'Thread': '18mm x 1.5' },
    fitment: { yearStart: 2006, yearEnd: 2014, makes: ['Honda', 'Acura'], models: ['Civic', 'Accord', 'TSX', 'TL'], engines: ['1.8L', '2.0L', '2.4L', '3.5L'], driveTypes: ['FWD', 'AWD'] }
  },

  // ── FUEL SYSTEM ────────────────────────────────────────────────────────────
  {
    id: 39, name: 'Fuel Injector - OEM Replacement', brand: 'Delphi', partNumber: 'DEL-FJ10722',
    categoryId: 'fuel', categoryName: 'Fuel System', condition: 'new', price: 38.99, coreCharge: 0, stockQty: 24, inStock: true, weight: 0.3,
    thumbnail: 'images/parts/unsplash-1609220136736.jpg',
    description: 'Delphi fuel injector. Factory-tested to meet OE flow rates and spray patterns. Direct replacement.',
    warrantyText: '2-Year Warranty', tags: 'fuel injector oem delphi',
    specs: { 'Flow Rate': 'OE Matched', 'Spray Pattern': 'Multi-Hole', 'O-Rings': 'Included', 'Tested': 'Factory Flow-Tested' },
    fitment: { yearStart: 2004, yearEnd: 2012, makes: ['Chevrolet', 'GMC', 'Pontiac'], models: ['Multiple 3.5L'], engines: ['3.5L', '3.9L'], driveTypes: ['FWD', 'RWD'] }
  },
  {
    id: 40, name: 'Throttle Body - Remanufactured', brand: 'Cardone', partNumber: 'CRD-67-3018',
    categoryId: 'fuel', categoryName: 'Fuel System', condition: 'reman', price: 94.99, coreCharge: 35.00, stockQty: 7, inStock: true, weight: 1.8,
    thumbnail: 'images/parts/unsplash-1502877338535.jpg',
    description: 'Cardone remanufactured throttle body. 100% remanufactured with new TPS sensor and seals. Plug-and-play.',
    warrantyText: '18-Month Warranty', tags: 'throttle body reman cardone electronic',
    specs: { 'Type': 'Electronic (ETC)', 'Bore Diameter': '60mm', 'TPS Sensor': 'New', 'Calibration': 'Pre-Set' },
    fitment: { yearStart: 2007, yearEnd: 2013, makes: ['Jeep', 'Chrysler', 'Dodge'], models: ['Grand Cherokee', '300', 'Charger'], engines: ['3.6L', '5.7L', '6.4L'], driveTypes: ['RWD', 'AWD', '4WD'] }
  },
  {
    id: 41, name: 'Carburetor - Remanufactured 2-Barrel', brand: 'Edelbrock', partNumber: 'EDE-1906',
    categoryId: 'fuel', categoryName: 'Fuel System', condition: 'reman', price: 159.99, coreCharge: 40.00, stockQty: 5, inStock: true, weight: 4.2,
    thumbnail: 'images/parts/unsplash-1486262715619.jpg',
    description: 'Edelbrock Performer 2-barrel carburetor. Remanufactured to exacting tolerances. Immediate throttle response.',
    warrantyText: '3-Year Warranty', tags: 'carburetor 2-barrel edelbrock performer reman',
    specs: { 'CFM': '500', 'Venturi': '2-Barrel', 'Choke': 'Electric', 'Fuel Inlet': '7/8-20 thread' },
    fitment: { yearStart: 1975, yearEnd: 1985, makes: ['Ford'], models: ['Mustang', 'F-150', 'Bronco'], engines: ['302', '351W'], driveTypes: ['RWD'] }
  },

  // ── BODY & TRIM ────────────────────────────────────────────────────────────
  {
    id: 42, name: 'Side Mirror - Passenger Heated Power', brand: 'Dorman', partNumber: 'DRM-955-1437',
    categoryId: 'body', categoryName: 'Body & Trim', condition: 'new', price: 58.99, coreCharge: 0, stockQty: 12, inStock: true, weight: 2.9,
    thumbnail: 'images/parts/unsplash-1621252179027.jpg',
    description: 'Dorman side view mirror assembly. Heated power glass. Direct bolt-on with OEM connector.',
    warrantyText: '1-Year Warranty', tags: 'side mirror passenger heated power fold dorman',
    specs: { 'Side': 'Passenger (Right)', 'Heated': 'Yes', 'Power Adjust': 'Yes', 'Turn Signal': 'Integrated' },
    fitment: { yearStart: 2013, yearEnd: 2018, makes: ['Ford'], models: ['Fusion', 'Escape'], engines: ['All'], driveTypes: ['FWD', 'AWD'] }
  },
  {
    id: 43, name: 'Fender - Front Left Primed', brand: 'Sherman', partNumber: 'SHR-505-53L',
    categoryId: 'body', categoryName: 'Body & Trim', condition: 'new', price: 134.99, coreCharge: 0, stockQty: 5, inStock: true, weight: 8.6,
    thumbnail: 'images/parts/unsplash-1609220136736.jpg',
    description: 'Sherman replacement front fender. Primed and ready to paint. 18-gauge steel construction.',
    warrantyText: '1-Year Warranty', tags: 'fender front left primed sherman steel',
    specs: { 'Side': 'Driver (Left)', 'Finish': 'Primed', 'Material': '18-Gauge Steel', 'Mounting': 'Bolt-On' },
    fitment: { yearStart: 2014, yearEnd: 2020, makes: ['Chevrolet'], models: ['Silverado 1500'], engines: ['All'], driveTypes: ['RWD', '4WD'] }
  },
  {
    id: 44, name: 'Weatherstrip - Door Seal Full Set', brand: 'Metro Moulded', partNumber: 'MMP-DS-202',
    categoryId: 'body', categoryName: 'Body & Trim', condition: 'new', price: 44.99, coreCharge: 0, stockQty: 20, inStock: true, weight: 2.2,
    thumbnail: 'images/parts/unsplash-1502877338535.jpg',
    description: 'Full door weatherstrip kit. EPDM rubber construction resists UV, ozone, and temperature extremes.',
    warrantyText: 'Lifetime Warranty', tags: 'weatherstrip door seal rubber epdm set',
    specs: { 'Material': 'EPDM Rubber', 'UV Resistant': 'Yes', 'Doors': 'All Four', 'Adhesive': 'Included' },
    fitment: { yearStart: 1967, yearEnd: 1972, makes: ['Chevrolet'], models: ['C10', 'C20', 'Blazer'], engines: ['All'], driveTypes: ['RWD', '4WD'] }
  },

  // ── LIGHTING ───────────────────────────────────────────────────────────────
  {
    id: 45, name: 'LED Headlight Bulbs - H11 6000K White', brand: 'Sylvania', partNumber: 'SYL-H11SZ.BP2',
    categoryId: 'lighting', categoryName: 'Lighting', condition: 'new', price: 49.99, coreCharge: 0, stockQty: 38, inStock: true, weight: 0.5,
    thumbnail: 'images/parts/unsplash-1486262715619.jpg',
    description: 'Sylvania LED headlight bulbs. 2x brighter than stock halogen. 6000K pure white. Plug-and-play pair.',
    warrantyText: '3-Year Warranty', tags: 'led headlight h11 6000k white sylvania pair',
    specs: { 'Bulb Type': 'H11', 'Color Temp': '6000K', 'Lumens': '6000 per pair', 'Type': 'LED' },
    fitment: { yearStart: 2005, yearEnd: 2023, makes: ['Universal H11'], models: ['Multiple'], engines: ['All'], driveTypes: ['All'] }
  },
  {
    id: 46, name: 'Tail Light Assembly - Driver Side', brand: 'TYC', partNumber: 'TYC-11-6008-00',
    categoryId: 'lighting', categoryName: 'Lighting', condition: 'new', price: 64.99, coreCharge: 0, stockQty: 9, inStock: true, weight: 3.2,
    thumbnail: 'images/parts/unsplash-1621252179027.jpg',
    description: 'TYC replacement tail light assembly. DOT/SAE certified. Factory-style lens design with OE bulbs.',
    warrantyText: '1-Year Warranty', tags: 'tail light assembly driver left TYC',
    specs: { 'Side': 'Driver (Left)', 'Bulbs': 'Included', 'DOT/SAE': 'Certified', 'Connector': 'OEM Match' },
    fitment: { yearStart: 2012, yearEnd: 2015, makes: ['Honda'], models: ['Civic'], engines: ['All'], driveTypes: ['FWD'] }
  },

  // ── A/C & HEATING ──────────────────────────────────────────────────────────
  {
    id: 47, name: 'A/C Compressor - Remanufactured', brand: 'Denso', partNumber: 'DEN-471-1182',
    categoryId: 'ac', categoryName: 'A/C & Heating', condition: 'reman', price: 174.99, coreCharge: 50.00, stockQty: 6, inStock: true, weight: 14.5,
    thumbnail: 'images/parts/unsplash-1609220136736.jpg',
    description: 'Denso remanufactured A/C compressor. New clutch, seals, and oil. 100% functional test before shipment.',
    warrantyText: '1-Year Warranty', tags: 'ac compressor reman denso air conditioning',
    specs: { 'Type': 'Scroll', 'Clutch': 'New', 'Oil': 'Pre-Charged', 'Test': '100% Pressure Tested' },
    fitment: { yearStart: 2007, yearEnd: 2012, makes: ['Toyota'], models: ['Camry', 'Venza', 'RAV4'], engines: ['2.4L', '2.5L', '3.5L'], driveTypes: ['FWD', 'AWD'] }
  },
  {
    id: 48, name: 'Heater Core', brand: 'Spectra Premium', partNumber: 'SPC-94508',
    categoryId: 'ac', categoryName: 'A/C & Heating', condition: 'new', price: 44.99, coreCharge: 0, stockQty: 11, inStock: true, weight: 2.8,
    thumbnail: 'images/parts/unsplash-1502877338535.jpg',
    description: 'Spectra Premium heater core. Aluminum construction. 100% pressure tested to 150 PSI.',
    warrantyText: '3-Year Warranty', tags: 'heater core spectra premium aluminum',
    specs: { 'Material': 'Aluminum', 'Pressure Test': '150 PSI', 'Inlet/Outlet': 'OE Diameter', 'Fins': 'OE Configuration' },
    fitment: { yearStart: 2004, yearEnd: 2010, makes: ['Ford'], models: ['F-150', 'Expedition'], engines: ['4.6L', '5.4L'], driveTypes: ['RWD', '4WD'] }
  }
);
