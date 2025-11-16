import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import DoctorProfile from '../models/DoctorProfile.js';

describe('DoctorProfile model', () => {
  let mongod;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  beforeEach(async () => {
    await DoctorProfile.deleteMany({});
  });

  test('enforces unique license_number', async () => {
    const license = 'ABC-123';
    const doc1 = new DoctorProfile({ user_id: new mongoose.Types.ObjectId(), specialization: 'Cardio', license_number: license, qualification: 'MBBS', experience_years: 5, consultation_fee: 50 });
    await doc1.save();

    const doc2 = new DoctorProfile({ user_id: new mongoose.Types.ObjectId(), specialization: 'Neuro', license_number: license.toLowerCase(), qualification: 'MD', experience_years: 3, consultation_fee: 40 });

    let thrown = null;
    try {
      await doc2.save();
    } catch (err) {
      thrown = err;
    }

    expect(thrown).not.toBeNull();
    // duplicate key error code from Mongo
    expect(thrown && (thrown.code === 11000 || thrown.message.includes('duplicate'))).toBeTruthy();
  });
});
