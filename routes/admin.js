const express = require('express');
const router = express.Router();
const db = require('../db');
const util = require('util');
const query = util.promisify(db.query).bind(db);

// ==================== Admin Login ====================
router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admins = await query('SELECT * FROM admin WHERE username=? AND password=?', [username, password]);
        if (admins.length > 0) {
            req.session.admin = admins[0];
            res.redirect('/admin/dashboard');
        } else {
            res.send('Login failed. <a href="/admin/login">Try again</a>');
        }
    } catch (err) {
        console.error(err);
        res.send('Error during login');
    }
});

// ==================== Dashboard ====================
router.get('/dashboard', (req, res) => {
    if (!req.session.admin) return res.redirect('/admin/login');
    res.render('admin/dashboard');
});

// ==================== Personal Info ====================
router.get('/personal', async (req, res) => {
    const personal = await query('SELECT * FROM personal_info LIMIT 1');
    res.render('admin/personal', { personal: personal[0] });
});

router.post('/personal', async (req, res) => {
    const { full_name, email, phone, address } = req.body;
    const exists = await query('SELECT * FROM personal_info LIMIT 1');
    if (exists.length > 0) {
        await query('UPDATE personal_info SET full_name=?, email=?, phone=?, address=? WHERE id=?',
            [full_name, email, phone, address, exists[0].id]);
    } else {
        await query('INSERT INTO personal_info SET ?', { full_name, email, phone, address });
    }
    res.redirect('/admin/personal');
});

// ==================== Education ====================
router.get('/education', async (req, res) => {
    const education = await query('SELECT * FROM education ORDER BY start_year DESC');
    res.render('admin/education', { education });
});

router.post('/education', async (req, res) => {
    const { institution, qualification, start_year, end_year, description } = req.body;
    await query('INSERT INTO education SET ?', { institution, qualification, start_year, end_year, description });
    res.redirect('/admin/education');
});

router.get('/education/delete/:id', async (req, res) => {
    await query('DELETE FROM education WHERE id=?', [req.params.id]);
    res.redirect('/admin/education');
});

// ==================== Work Experience ====================
router.get('/work', async (req, res) => {
    const work = await query('SELECT * FROM related_experience ORDER BY start_date DESC');
    res.render('admin/work', { work });
});

router.post('/work', async (req, res) => {
    const { company, position, start_date, end_date, description } = req.body;
    await query('INSERT INTO related_experience SET ?', { company, position, start_date, end_date, description });
    res.redirect('/admin/work');
});

router.get('/work/delete/:id', async (req, res) => {
    await query('DELETE FROM related_experience WHERE id=?', [req.params.id]);
    res.redirect('/admin/work');
});

// ==================== Skills ====================
router.get('/skills', async (req, res) => {
    const skills = await query('SELECT * FROM skills ORDER BY skill_level DESC');
    res.render('admin/skills', { skills });
});

router.post('/skills', async (req, res) => {
    const { skill_name, skill_level } = req.body;
    await query('INSERT INTO skills SET ?', { skill_name, skill_level });
    res.redirect('/admin/skills');
});

router.get('/skills/delete/:id', async (req, res) => {
    await query('DELETE FROM skills WHERE id=?', [req.params.id]);
    res.redirect('/admin/skills');
});

// ==================== Awards ====================
router.get('/awards', async (req, res) => {
    const awards = await query('SELECT * FROM awards ORDER BY year DESC');
    res.render('admin/awards', { awards });
});

router.post('/awards', async (req, res) => {
    const { title, year, description } = req.body;
    await query('INSERT INTO awards SET ?', { title, year, description });
    res.redirect('/admin/awards');
});

router.get('/awards/delete/:id', async (req, res) => {
    await query('DELETE FROM awards WHERE id=?', [req.params.id]);
    res.redirect('/admin/awards');
});

// ==================== References ====================
router.get('/references', async (req, res) => {
    const references = await query('SELECT * FROM reference');
    res.render('admin/references', { references });
});

router.post('/references', async (req, res) => {
    const { name, position, email, phone } = req.body;
    await query('INSERT INTO reference SET ?', { name, position, email, phone });
    res.redirect('/admin/references');
});

router.get('/references/delete/:id', async (req, res) => {
    await query('DELETE FROM reference WHERE id=?', [req.params.id]);
    res.redirect('/admin/references');
});

// ==================== Logout ====================
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

module.exports = router;
