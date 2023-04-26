import { Router } from 'express';
import { ISanciones, Sanciones } from '@server/libs/Sanciones';
import { commonValidator, validateInput } from '@server/utils/validator';
import { WithUserRequest } from '@routes/index';
import { jwtValidator } from '@server/middleware/jwtBeaereValidator';
const router = Router();
const sancionInstance = new Sanciones();

router.get('/all', async (_req, res) => {
  try {
    res.json(await sancionInstance.getAllSanciones());
  } catch (ex) {
    console.error(ex);
    res.status(503).json({ error: ex });
  }
}); 
router.get('/foryou', async (req, res) => {
  try {
    const { page, items } = { page: '1', items: '10', ...req.query };
    res.json(
      await sancionInstance.getSancionesPaged(Number(page), Number(items)),
    );
  } catch (ex) {
    console.error(ex);
    res.status(503).json({ error: ex });
  }
});
router.get('/', async (req , res) => {
  try {
    const { page, items } = { page: '1', items: '10', ...req.query };
    console.log('SANCIONES' );
    res.json(
      await sancionInstance.getSancionesPaged(
        Number(page),
        Number(items),
      ),
    );
  } catch (ex) {
    console.error(ex);
    res.status(503).json({ error: ex });
  }
});

router.get('/summary', jwtValidator, async (req: WithUserRequest, res) => {
  try {
    res.json(await sancionInstance.getTypeSumarry(req.user._id));
  } catch (ex) {
    console.error(ex);
    res.status(503).json({ error: ex });
  }
});

router.get('/count', jwtValidator, async (req: WithUserRequest, res) => {
  try {
    res.json({ count: await sancionInstance.getCountSanciones(req.user._id) });
  } catch (ex) {
    console.error(ex);
    res.status(503).json({ error: ex });
  }
});

router.get('/byindex/:index', jwtValidator, async (req, res) => {
  try {
    const { index: id } = req.params;
    res.json(await sancionInstance.getSancionesByIndex(id));
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ msg: 'Error al obtener Registro' });
  }
});

router.post('/testvalidator', jwtValidator, async (req, res) => {
  const { email } = req.body;

  const validateEmailSchema = commonValidator.email;
  validateEmailSchema.param = 'email';
  validateEmailSchema.required = true;
  validateEmailSchema.customValidate = (values) => {
    return values.includes('unicah.edu');
  };
  const errors = validateInput({ email }, [validateEmailSchema]);
  if (errors.length > 0) {
    return res.status(400).json(errors);
  }
  return res.json({ email });
});

router.post('/new', jwtValidator, async (req: WithUserRequest, res) => {
  try {
    const { _id: userId } = req.user;
    console.log({ body: req.body });

    const newSancion = req.body as unknown as ISanciones;
    //VALIDATE

    const newsancionIndex = await sancionInstance.addSanciones(
      newSancion,
      userId,
    );
    res.json({ newIndex: newsancionIndex });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/update/:index', jwtValidator, async (req, res) => {
  try {
    const { index: id } = req.params;
    const sancionFromForm = req.body as ISanciones;
    await sancionInstance.updateSanciones(id, sancionFromForm);
    res.status(200).json({ msg: 'Registro Actualizado' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/delete/:index', jwtValidator, (req, res) => {
  try {
    const { index: id } = req.params;
    if (sancionInstance.deleteSanciones(id)) {
      res.status(200).json({ msg: 'Registro Eliminado' });
    } else {
      res.status(500).json({ msg: 'Error al eliminar Registro' });
    }
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ msg: 'Error al eliminar Registro' });
  }
});

export default router;
