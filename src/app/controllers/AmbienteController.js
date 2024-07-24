// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';

import Ambiente from '../models/Ambiente';

class AmbienteController {
    async index(req, res) {
        const ambientes = await Ambiente.findAll();

        return res.json(ambientes);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        });

        const ambienteExist = await Ambiente.findOne({
            where: { name: req.body.name },
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        if (ambienteExist) {
            return res.status(400).json({ error: 'Ambiente já existe. ' });
        }

        const { id, name } = await Ambiente.create(req.body);

        return res.json({
            id,
            name,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
        });

        try {
            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'falha na validação' });
            }

            const ambiente = await Ambiente.findByPk(req.params.id);

            // Verifica se o ambiente já existe na base de dados

            const ambienteExist = await Ambiente.findOne({
                where: { name: req.body.name },
            });

            if (ambienteExist) {
                return res.status(400).json({ error: 'Ambiente já existe. ' });
            }

            await ambiente.update(req.body);
            return res.json(ambiente);
        } catch (erro) {
            console.log('Erro no update ', erro);
            return res.json({ erro });
        }
    }

    async searchById(req, res) {
        const { id } = req.params;

        const ambiente = await Ambiente.findByPk(id);

        if (!ambiente) {
            return res.status(400).json({ error: 'Ambiente não existe. ' });
        }

        return res.json(ambiente);
    }

    async delete(req, res) {
        const { id } = req.params;

        const ambiente = await Ambiente.findByPk(id);

        if (!ambiente) {
            return res.status(400).json({ error: 'Ambiente não existe. ' });
        }

        await ambiente.destroy();
        return res.status(200).send();
    }
}

export default new AmbienteController();
