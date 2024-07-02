import { Router } from 'express';
import { getFolders, getFolder, createChildFolder, updateFolder, deleteFolder } from '../controllers/folder.controller';

const router: Router = Router();

router.get('/list', getFolders);
router.get('/:folderId', getFolder);
router.post('/create/:parentId', createChildFolder);
router.put('/update/:id', updateFolder);
router.delete('/delete/:id', deleteFolder);

export default router;