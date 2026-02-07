const express = require('express');
const router = express.Router();
const db = require('../db');
const util = require('util');
const query = util.promisify(db.query).bind(db);

router.get('/', async (req, res) => {
  try {
    const personal = await query('SELECT * FROM personal_info LIMIT 1');
    const objective = await query('SELECT * FROM objective LIMIT 1');
    const education = await query('SELECT * FROM education');
    const work = await query('SELECT * FROM related_experience');
    const awards = await query('SELECT * FROM awards');
    const skills = await query('SELECT * FROM skills');
    const references = await query('SELECT * FROM reference');

    res.render('public/home', {
      data: { personal, objective, education, work, awards, skills, references }
    });
  } catch (err) {
    console.error(err);
    res.send('Error fetching data');
  }
});

module.exports = router;
