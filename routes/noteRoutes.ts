import express from 'express';
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();

import noteController from '../controllers/noteController';

const router = express.Router();

router.get('/', noteController.note_get);
router.post('/', noteController.note_create_post);
router.get('/create', noteController.note_create_get);
router.get('/:filename', noteController.note_details);
router.delete('/delete', noteController.note_delete);
router.post('/update', noteController.note_update);

module.exports = router;