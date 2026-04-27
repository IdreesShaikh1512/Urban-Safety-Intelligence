/**
 * seed.js — Guaranteed full-coverage seeding
 *
 * Strategy: loop every city × area × crime type × year combination
 * and insert 2–5 records each → guarantees data for ANY filter combination.
 *
 * Total: 10 cities × 6 areas × 10 types × 6 years × ~3 records ≈ 10,800 records
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Crime = require('./models/Crime');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crimedb';

const CITY_AREAS = {
    Mumbai: ['Dharavi', 'Andheri', 'Bandra', 'Kurla', 'Borivali', 'Worli'],
    Delhi: ['Connaught Place', 'Karol Bagh', 'Dwarka', 'Rohini', 'Lajpat Nagar', 'Saket'],
    Bangalore: ['Koramangala', 'Whitefield', 'Indiranagar', 'Hebbal', 'Electronic City', 'BTM Layout'],
    Chennai: ['T. Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'Tambaram', 'Mylapore'],
    Kolkata: ['Park Street', 'Howrah', 'Salt Lake', 'Dum Dum', 'Behala', 'Tollygunge'],
    Hyderabad: ['Banjara Hills', 'Secunderabad', 'Hitech City', 'Kukatpally', 'LB Nagar', 'Ameerpet'],
    Pune: ['Koregaon Park', 'Kothrud', 'Hadapsar', 'Wakad', 'Baner', 'Viman Nagar'],
    Ahmedabad: ['Navrangpura', 'Maninagar', 'Vastrapur', 'Bodakdev', 'Gota', 'Bopal'],
    Jaipur: ['Pink City', 'Vaishali Nagar', 'Malviya Nagar', 'Mansarovar', 'Tonk Road', 'C-Scheme'],
    Surat: ['Adajan', 'Vesu', 'Katargam', 'Udhna', 'Rander', 'Althan'],
};

const CRIME_TYPES = [
    'Theft', 'Assault', 'Robbery', 'Murder', 'Fraud',
    'Kidnapping', 'Vandalism', 'Cybercrime', 'Drug Trafficking', 'Arson',
];

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(year) {
    const month = Math.floor(Math.random() * 12);
    const day = randomInt(1, 28);
    return new Date(year, month, day);
}

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await Crime.deleteMany({});
    console.log('🗑️  Cleared existing records');

    const records = [];

    // ── Guaranteed coverage: every combination gets 2–5 records ──
    for (const [city, areas] of Object.entries(CITY_AREAS)) {
        for (const area of areas) {
            for (const type of CRIME_TYPES) {
                for (const year of YEARS) {
                    const count = randomInt(2, 5);
                    for (let i = 0; i < count; i++) {
                        records.push({ city, area, type, date: randomDate(year) });
                    }
                }
            }
        }
    }

    // ── Extra random records for variety in charts ──
    const CITIES = Object.keys(CITY_AREAS);
    for (let i = 0; i < 500; i++) {
        const city = CITIES[randomInt(0, CITIES.length - 1)];
        const areas = CITY_AREAS[city];
        records.push({
            city,
            area: areas[randomInt(0, areas.length - 1)],
            type: CRIME_TYPES[randomInt(0, CRIME_TYPES.length - 1)],
            date: randomDate(YEARS[randomInt(0, YEARS.length - 1)]),
        });
    }

    // Insert in batches of 1000
    const BATCH = 1000;
    for (let i = 0; i < records.length; i += BATCH) {
        await Crime.insertMany(records.slice(i, i + BATCH));
    }

    console.log(`✅ Seeded ${records.length} crime records (full coverage guaranteed)`);
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
});
