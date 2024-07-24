import { Router } from 'express';
import AmbienteController from './app/controllers/AmbienteController';
import DeployController from './app/controllers/DeployController';
import FuncionalidadeController from './app/controllers/FuncionalidadeController';
import ProfileController from './app/controllers/ProfileController';
import ProjectController from './app/controllers/ProjectController';
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
routes.get('/users/logged', UserController.userLogged);
routes.put('/users/:id', UserController.updateSomeone);
routes.get('/users/:id', UserController.searchById);
routes.get('/users/paginate/index/:page', UserController.index);
routes.post('/users/paginate/search', UserController.indexSearch);

// Resource de perfis
routes.get('/profiles', ProfileController.index);
routes.get('/profiles/users/:id', ProfileController.searchUsersForId);
routes.get('/profiles/:id', ProfileController.searchById);
routes.delete('/profiles/:id', ProfileController.delete);

// Resource de projects
routes.post('/projects', ProjectController.store);
routes.get('/projects', ProjectController.index);
routes.put('/projects/:id', ProjectController.update);
routes.get('/projects/:id', ProjectController.searchById);
routes.delete('/projects/:id', ProjectController.delete);

// Resource de ambientes
routes.post('/ambientes', AmbienteController.store);
routes.get('/ambientes', AmbienteController.index);
routes.put('/ambientes/:id', AmbienteController.update);
routes.get('/ambientes/:id', AmbienteController.searchById);
routes.delete('/ambientes/:id', AmbienteController.delete);

// Resource de funcionalidades
routes.post('/funcionalidades', FuncionalidadeController.store);
routes.get('/funcionalidades', FuncionalidadeController.index);
routes.put('/funcionalidades/:id', FuncionalidadeController.update);
routes.get('/funcionalidades/:id', FuncionalidadeController.searchById);
routes.delete('/funcionalidades/:id', FuncionalidadeController.delete);

// Resource de deploys
routes.post('/deploys', DeployController.store);
routes.get('/deploys', DeployController.index);
routes.put('/deploys/:id', DeployController.update);
routes.get('/deploys/:id', DeployController.searchById);
routes.delete('/deploys/:id', DeployController.delete);

export default routes;
