// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';

import { Op } from 'sequelize';
import Ambiente from '../models/Ambiente';
import Deploy from '../models/Deploy';
import Project from '../models/Project';
import User from '../models/User';

class DeployController {
    async index(req, res) {
        try {
            const { page = 1, pageSize = 10 } = req.params;

            const offset = (page - 1) * pageSize;

            const deploys = await Deploy.findAndCountAll({
                include: [
                    {
                        model: Project,
                        as: 'project',
                    },
                    {
                        model: Ambiente,
                        as: 'ambiente',
                    },
                    {
                        model: User,
                        as: 'user',
                    },
                ],

                limit: pageSize,
                offset,
            });

            const totalPages = Math.ceil(deploys.count / pageSize);

            return res.json({
                currentPage: parseInt(page, 10),
                totalPages,
                totalCount: deploys.count,
                deploys: deploys.rows,
            });
        } catch (erro) {
            return res.status(500).json(erro);
        }
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            project_id: Yup.number().required(),
            ambiente_id: Yup.number().required(),
            versao: Yup.string().required(),
            data: Yup.string().required(),
            user_id: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }
        try {
            const deployExist = await Deploy.findOne({
                where: { versao: req.body.versao },
            });

            if (deployExist) {
                return res
                    .status(400)
                    .json({ error: 'Versão do deploy já existe. ' });
            }

            const deploy = {
                project_id: req.body.project_id,
                ambiente_id: req.body.ambiente_id,
                versao: req.body.versao,
                data: req.body.data,
                user_id: req.body.user_id,
            };

            console.log('Dados do deploy: ', deploy);

            const { project_id, ambiente_id, versao, data, user_id } =
                await Deploy.create(deploy);

            return res.json({
                project_id,
                ambiente_id,
                versao,
                data,
                user_id,
            });
        } catch (erro) {
            return res.status(500).json(erro);
        }
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            project_id: Yup.number(),
            ambiente_id: Yup.number(),
            versao: Yup.string(),
            data: Yup.string(),
            user_id: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        try {
            const deploy = await Deploy.findByPk(req.params.id);

            if (!deploy) {
                return res
                    .status(404)
                    .json({ error: 'Deploy não encontrado.' });
            }

            const deployExist = await Deploy.findOne({
                where: {
                    versao: req.body.versao,
                    id: { [Op.ne]: req.params.id },
                },
            });

            if (deployExist) {
                return res
                    .status(400)
                    .json({ error: 'Versão do deploy já existe.' });
            }

            const { id, project_id, ambiente_id, versao, data, user_id } =
                await deploy.update(req.body);

            return res.json({
                id,
                project_id,
                ambiente_id,
                versao,
                data,
                user_id,
            });
        } catch (erro) {
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

    async searchById(req, res) {
        try {
            const { id } = req.params;

            const deploy = await Deploy.findByPk(id, {
                include: [
                    {
                        model: Project,
                        as: 'project',
                    },
                    {
                        model: Ambiente,
                        as: 'ambiente',
                    },
                    {
                        model: User,
                        as: 'user',
                    },
                ],
            });

            if (!deploy) {
                return res
                    .status(404)
                    .json({ error: 'Deploy não encontrado.' });
            }

            return res.json(deploy);
        } catch (erro) {
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const deploy = await Deploy.findByPk(id);

            if (!deploy) {
                return res
                    .status(404)
                    .json({ error: 'Deploy não encontrado.' });
            }

            await deploy.destroy();
            return res.status(204).send();
        } catch (erro) {
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
}

export default new DeployController();
