import { Router } from 'express';
import ProfileController from './app/controllers/ProfileController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.delete('/users/:id', UserController.delete);
routes.post('/sessions', SessionController.store);
routes.post('/sessions/fab', SessionController.storeFab);
routes.get('/sessions/google/:idToken', SessionController.storeGoogle);
routes.put('/users/google/:id', UserController.updateGoogle);

// Todas as rotas abaixo precisam estar autenticadas
routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.put('/users/:id', UserController.updateSomeone);
routes.get('/users/:id', UserController.searchById);
routes.get('/users/paginate/index/:page', UserController.index);
routes.post('/users/paginate/search', UserController.indexSearch);

// Resource de perfis
routes.get('/profiles', ProfileController.index);
routes.get('/profiles/users/:id', ProfileController.searchUsersForId);
routes.get('/profiles/:id', ProfileController.searchById);
routes.delete('/profiles/:id', ProfileController.delete);

export default routes;
