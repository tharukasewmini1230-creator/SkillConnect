router.get('/', getResources);
router.get('/my', protect, getMyResources);
router.get('/popular', getPopularResources);
router.get('/:id', getResourceById);
router.post('/', protect, resourceUpload.single('file'), createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);
router.get('/:id/download', downloadResource);