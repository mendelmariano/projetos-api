// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';

import Project from '../models/Project';
import User from '../models/User';

class ProjectController {
    async index(req, res) {
        const projects = await Project.findAll();

        return res.json(projects);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        });

        const projectExist = await Project.findOne({
            where: { name: req.body.name },
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        if (projectExist) {
            return res.status(400).json({ error: 'Projeto já existe. ' });
        }

        const { id, name } = await Project.create(req.body);

        return res.json({
            id,
            name,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        const project = await Project.findByPk(req.projectId);

        // Verifica se o projeto já existe na base de dados

        const projectExist = await Project.findOne({
            where: { name: req.body.name },
        });

        if (projectExist) {
            return res.status(400).json({ error: 'Projeto já existe. ' });
        }

        const { id, name } = await project.update(req.body);
        return res.json({
            id,
            name,
        });
    }

    async searchById(req, res) {
        const { id } = req.params;

        const project = await Project.findByPk(id);

        if (!project) {
            return res.status(400).json({ error: 'Projeto não existe. ' });
        }

        return res.json(project);
    }

    async searchUsersForId(req, res) {
        const { id } = req.params;

        const project = await Project.findOne({
            where: { id },
            include: User,
        });

        if (!project) {
            return res.status(400).json({ error: 'Projeto não existe. ' });
        }

        return res.json(project);
    }

    async delete(req, res) {
        const { project_id } = req.params;

        const project = await Project.findByPk(project_id);

        if (!project) {
            return res.status(400).json({ error: 'Projeto não existe. ' });
        }

        await project.destroy();
        return res.status(200).send();
    }
}

export default new ProjectController();
